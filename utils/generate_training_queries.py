#!/usr/bin/env python3

import os
import json
import argparse
from pathlib import Path
import openai
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrainingDataGenerator:
    def __init__(self, api_key=None):
        """Initialize with OpenAI API key. If not provided, will try to get from environment."""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key must be provided or set in OPENAI_API_KEY environment variable")
        openai.api_key = self.api_key

    def read_file_if_exists(self, file_path):
        """Read file content if it exists, return empty string otherwise."""
        try:
            with open(file_path, 'r') as f:
                return f.read()
        except:
            return ""

    def get_visualization_context(self, viz_dir):
        """Gather context from a visualization directory."""
        js_files = list(Path(viz_dir).glob('*.js'))
        if not js_files:
            return None

        js_file = js_files[0]  # Take the first JS file
        viz_name = viz_dir.name

        # Read various context files
        js_content = self.read_file_if_exists(js_file)
        data_report = self.read_file_if_exists(viz_dir / 'data_report.txt')
        inferred_report = self.read_file_if_exists(viz_dir / 'inferred_data_report.txt')
        explanation = self.read_file_if_exists(viz_dir / 'explanation.txt')

        # Use inferred report if no data report available
        report = data_report if data_report else inferred_report

        return {
            'name': viz_name,
            'js_content': js_content,
            'report': report,
            'explanation': explanation
        }

    def generate_queries(self, context, temperature=0):
        """Generate natural language queries that would lead to this visualization."""
        prompt = f"""
You are an expert in data visualization and D3.js. Your task is to generate 5 natural language queries that users might ask to create a visualization based on the provided context. The queries should reflect realistic goals a user might have when working with data and designing visualizations.

Visualization Name: {context['name']}

Data Structure:
{context['report']}

Explanation:
{context['explanation']}

JavaScript Implementation:
{context['js_content']}

### Guidelines for Queries
1. Focus on the goals or outcomes of the visualization, not specific implementation details.
2. Make the queries varied in phrasing and intent to cover diverse user needs.
3. Ensure the queries are realistic and natural-sounding, as if asked by a non-technical user.

Respond in the following JSON format:
{{
    "queries": [
        {{
            "query": "The natural language query",
        }},
        {{
            "query": "...",
        }},
        {{
            "query": "...",
        }},
        ...,
    ]
}}"""

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert in data visualization and D3.js."},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature
        )

        try:
            content = response.choices[0].message.content
            # Handle potential markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            return json.loads(content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse response for {context['name']}: {str(e)}")
            logger.error(f"Raw response: {response.choices[0].message.content}")
            return None

    def save_queries(self, queries, viz_dir):
        """Save queries to a JSON file in the visualization directory."""
        output_path = viz_dir / 'queries.json'
        with open(output_path, 'w') as f:
            json.dump(queries, f, indent=2)
        return output_path

def main():
    parser = argparse.ArgumentParser(description='Generate training data for D3 visualizations')
    parser.add_argument('--gallery-dir', '-d', 
                       default=os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                                          'root_resources', 'd3_gallery_downloads'),
                       help='Directory containing D3 visualizations')
    parser.add_argument('--temperature', '-t', type=float, default=0.0,
                       help='OpenAI temperature parameter (default: 0.7)')
    parser.add_argument('--api-key', help='OpenAI API key (optional, can use OPENAI_API_KEY env var)')
    
    args = parser.parse_args()

    generator = TrainingDataGenerator(api_key=args.api_key)
    failed_generations = []
    successful_generations = []

    # Process each visualization directory
    gallery_path = Path(args.gallery_dir)
    for viz_dir in sorted(gallery_path.iterdir()):
        if not viz_dir.is_dir():
            continue

        logger.info(f"Processing {viz_dir.name}...")
        context = generator.get_visualization_context(viz_dir)
        if not context:
            logger.warning(f"Skipping {viz_dir.name}: No visualization files found")
            continue

        result = generator.generate_queries(context, temperature=args.temperature)
        if result:
            # Save queries to the visualization directory
            output_path = generator.save_queries(result, viz_dir)
            successful_generations.append(viz_dir.name)
            logger.info(f"Generated {len(result['queries'])} queries for {viz_dir.name}")
            logger.info(f"Saved queries to {output_path}")
        else:
            failed_generations.append(viz_dir.name)
            logger.error(f"Failed to generate queries for {viz_dir.name}")

    # Print summary
    logger.info("\nGeneration Summary:")
    logger.info(f"Successfully generated queries for {len(successful_generations)} visualizations")
    if failed_generations:
        logger.info(f"Failed to generate queries for {len(failed_generations)} visualizations:")
        for viz_name in failed_generations:
            logger.info(f"  - {viz_name}")

if __name__ == "__main__":
    main()