#!/usr/bin/env python3

import os
import json
import argparse
from pathlib import Path
import openai
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class D3DataInferer:
    def __init__(self, api_key=None):
        """Initialize with OpenAI API key. If not provided, will try to get from environment."""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key must be provided or set in OPENAI_API_KEY environment variable")
        openai.api_key = self.api_key

    def extract_visualization_code(self, js_file_path):
        """Extract relevant visualization code from the JavaScript file."""
        with open(js_file_path, 'r') as f:
            content = f.read()
        return content

    def infer_data_structure(self, js_file_path, temperature=0):
        """Analyze D3 visualization code and infer the expected data structure."""
        code = self.extract_visualization_code(js_file_path)
        
        prompt = f"""Analyze this D3.js visualization code and:
1. Determine the expected data structure
2. Generate a small sample dataset that would work with this visualization
3. Explain the data format

Code:
{code}

Respond in the following JSON format:
{{
    "data_structure": "Description of the expected data format",
    "sample_data": [The actual sample data that would work],
    "explanation": "Detailed explanation of the data format and fields"
}}
"""

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a D3.js expert that analyzes visualizations and infers their required data structures."},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature
        )

        try:
            content = response.choices[0].message.content
            logger.info("Raw OpenAI response content: %s", content)
            
            # If the response is wrapped in a code block, extract just the JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            result = json.loads(content)
            return result
        except json.JSONDecodeError as e:
            # Store the raw response content for debugging
            error = ValueError("Failed to parse OpenAI response as JSON")
            error.response_content = response.choices[0].message.content
            logger.error("JSON parsing error: %s", str(e))
            logger.error("Failed to parse response: %s", response.choices[0].message.content)
            raise error

    def save_sample_data(self, data, output_path):
        """Save the sample data to a JSON file."""
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)

def main():
    parser = argparse.ArgumentParser(description='Infer D3 visualization data structure using OpenAI')
    parser.add_argument('visualization_file', help='Path to D3 visualization JavaScript file')
    parser.add_argument('--output', '-o', help='Output path for sample data JSON')
    parser.add_argument('--api-key', help='OpenAI API key (optional, can use OPENAI_API_KEY env var)')
    parser.add_argument('--temperature', type=float, default=0, help='Temperature parameter for OpenAI model (default: 0)')
    
    args = parser.parse_args()
    
    inferer = D3DataInferer(api_key=args.api_key)
    result = inferer.infer_data_structure(args.visualization_file, temperature=args.temperature)
    
    print("\nInferred Data Structure:")
    print(result['data_structure'])
    print("\nExplanation:")
    print(result['explanation'])
    
    if args.output:
        inferer.save_sample_data(result['sample_data'], args.output)
        print(f"\nSample data saved to: {args.output}")
    else:
        print("\nSample Data:")
        print(json.dumps(result['sample_data'], indent=2))

if __name__ == "__main__":
    main()
