#!/usr/bin/env python3

import os
import json
import openai
import logging
import time
import asyncio
import aiohttp
from pathlib import Path
from tqdm import tqdm
from typing import List, Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert software engineer specializing in data visualization. Your task is to analyze training data made to train LLMs for D3 visualizations - and generate high-quality, production-ready D3.js rebuilds of the provided json training data. For each request, follow these steps:

1. Analyze the Input-Output Pattern
Examine how the natural language request maps to the D3 implementation, identifying:
- The core visualization type requested
- Key configuration parameters
- Data preparation needs
- Interactive elements
- Error handling patterns

2. Standardize the Implementation 
Transform the code to follow a consistent pattern:
```javascript
/**
 * Creates a [visualization type] using D3
 * @param {Object} config - Configuration options
 * @param {string} config.containerId - Target DOM element ID
 * [Essential parameters based on visualization type]
 */
export default function createVisualization(config = {}) {
  // Container setup and validation
  // Data processing
  // Visualization rendering
  // Error handling
  // Event binding (if needed)
}
```

3. Document Pattern Variations
Note how similar requests produce different code variations to understand:
- When different approaches are used for the same visualization
- How parameters affect the implementation
- Common error handling patterns
- Reusable code segments

Your task is to generate a response formatted as a JSON object with two fields:
- "input": The original natural language request. Consider that the users request may not specify all parameters and could include details about the data or not. When requests include a Country name or geojson data, assume the visualization is agnostic of the location. include the url provided in the training data with a note "#example"
- "output": The standardized, production-ready D3.js code

For example:
```json
{
    "input": "Create a bar chart showing sales by country",
    "output": " Sure, Here's a simple bar chart using D3: \n\n ```javascript\nimport * as d3 from 'd3';\n\nexport default function createVisualization({\n  containerId = 'my_dataviz',\n  width = 460,\n  height = 400\n} = {}) {\n  // Implementation here\n}```"
}
```

Remember to maintain proper JSON escaping for the code in the output field. Your response should be valid JSON that could be directly used for training an LLM.

"""
class BatchProcessor:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key must be provided or set in OPENAI_API_KEY environment variable")
        openai.api_key = self.api_key

    async def process_example(self, session: aiohttp.ClientSession, example: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single example using the OpenAI API."""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Create a prompt that includes both input and original output
            user_prompt = f"""Analyze this D3.js visualization example and provide a refined version.

Original Request: {example['input']}

Original D3.js Implementation:
{example['output']}

Provide your response in the following JSON format EXACTLY (no additional text before or after):
{{
    "input": "<a creative variation of the original request appropriate for the data type>",
    "output": "A friendly response followed by the refined D3.js code including imports and full implementation, with adjustments ONLY as needed."
}}

IMPORTANT:
1. Your entire response must be valid JSON
2. Do not include any text outside the JSON object
3. Properly escape all quotes and newlines in the JSON
4. Include the complete implementation in the output field"""

            data = {
                "model": "gpt-4o",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0
            }
            
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data
            ) as response:
                result = await response.json()
                model_response = result['choices'][0]['message']['content']
                
                # Debug: Log the raw response
                logger.debug(f"Raw model response:\n{model_response}")
                
                # Try to parse the model's response as JSON
                try:
                    # Strip any potential markdown code block indicators
                    cleaned_response = model_response.strip()
                    if cleaned_response.startswith('```json'):
                        cleaned_response = cleaned_response[7:]
                    if cleaned_response.endswith('```'):
                        cleaned_response = cleaned_response[:-3]
                    cleaned_response = cleaned_response.strip()
                    
                    parsed_response = json.loads(cleaned_response)
                    
                    # Validate the response has the required fields
                    if not isinstance(parsed_response, dict) or \
                       'input' not in parsed_response or \
                       'output' not in parsed_response:
                        raise ValueError("Response missing required fields")
                    
                    return {
                        "input": parsed_response['input'],
                        "output": parsed_response['output'],
                        "original_output": example['output']
                    }
                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Invalid response format: {str(e)}")
                    logger.error(f"Attempted to parse:\n{cleaned_response}")
                    return {
                        "input": example['input'],
                        "error": f"Invalid response format: {str(e)}",
                        "raw_response": model_response
                    }
                    
        except Exception as e:
            logger.error(f"Error processing example: {str(e)}")
            return {
                "input": example['input'],
                "error": str(e)
            }

    async def process_batch(self, session: aiohttp.ClientSession, batch: List[Dict[str, Any]], 
                          example_pbar: tqdm) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Process a batch of examples concurrently."""
        tasks = [self.process_example(session, example) for example in batch]
        results = await asyncio.gather(*tasks)
        
        successes = []
        failures = []
        
        for result in results:
            if "error" in result:
                failures.append(result)
            else:
                successes.append(result)
            example_pbar.update(1)
            
        return successes, failures

    async def process_all_batches(self, training_data: List[Dict[str, Any]], batch_size: int, output_file: str) -> None:
        """Process all batches with concurrent requests within each batch and write results as we go."""
        failed = []
        
        # Create progress bar for batches
        total_batches = (len(training_data) + batch_size - 1) // batch_size
        batch_pbar = tqdm(total=total_batches, desc="Processing batches", position=0)
        
        # Start JSON array
        with open(output_file, 'w') as f:
            f.write('[\n')
        
        # Configure connection pooling
        conn = aiohttp.TCPConnector(limit=batch_size)
        async with aiohttp.ClientSession(connector=conn) as session:
            # Process in batches
            for i in range(0, len(training_data), batch_size):
                batch = training_data[i:i + batch_size]
                
                # Create progress bar for examples within the current batch
                with tqdm(total=len(batch), desc=f"Batch {i//batch_size + 1}/{total_batches}", 
                         position=1, leave=False) as example_pbar:
                    
                    results, failures = await self.process_batch(session, batch, example_pbar)
                    failed.extend(failures)
                    
                    # Write results immediately, maintaining JSON array format
                    with open(output_file, 'a') as f:
                        for j, result in enumerate(results):
                            # Add comma if not first item
                            if i > 0 or j > 0:
                                f.write(',\n')
                            # Write indented JSON object
                            json_str = json.dumps(result, indent=2)
                            # Indent the entire object
                            indented = '\n'.join('  ' + line for line in json_str.split('\n'))
                            f.write(indented)
                
                batch_pbar.update(1)
                
                # Add a small delay between batches
                if i + batch_size < len(training_data):
                    await asyncio.sleep(1)
        
        # Close JSON array
        with open(output_file, 'a') as f:
            f.write('\n]')
        
        batch_pbar.close()
        
        # Write failures to separate file
        if failed:
            failed_file = Path(output_file).parent / 'failed_queries.json'
            with open(failed_file, 'w') as f:
                json.dump(failed, f, indent=2)
            logger.info(f"Failed queries saved to {failed_file}")
        
        logger.info(f"Processing complete. Check {output_file} for results.")

    def process_in_batches(self, input_file: str, output_file: str, batch_size: int = 5, limit: int = None):
        """Process the data in batches using concurrent API calls."""
        with open(input_file, 'r') as f:
            training_data = json.load(f)

        if limit:
            training_data = training_data[:limit]
            logger.info(f"Limited to {limit} examples for development")

        # Create/clear the output file
        with open(output_file, 'w') as f:
            pass  # Just create/clear the file

        # Run the async processing
        asyncio.run(self.process_all_batches(training_data, batch_size, output_file))

def main():
    input_file = "./d3_training_data.json"
    output_file = "./refined_d3_training_data.json"
    
    processor = BatchProcessor()
    processor.process_in_batches(input_file, output_file, batch_size=5, limit=None)

if __name__ == "__main__":
    main()
