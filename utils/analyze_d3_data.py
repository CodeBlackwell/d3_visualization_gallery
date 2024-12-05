#!/usr/bin/env python3

import os
import re
import json
import subprocess
import requests
import tempfile
import argparse
import sys
from pathlib import Path

# Add the utils directory to Python path for local imports
sys.path.append(str(Path(__file__).parent.parent))
from utils.openai_infer import D3DataInferer

D3_GALLERY_PATH = "/home/juke/t5d3/root_resources/d3_gallery_downloads"
REPORT_DATA_PATH = "/home/juke/t5d3/utils/report_data"

def extract_data(js_file):
    """Extract both dataUrl and inline data from JavaScript file."""
    with open(js_file, 'r') as f:
        content = f.read()
    
    data_sources = {}
    
    # Look for dataUrl assignments
    url_matches = re.findall(r'dataUrl\s*=\s*[\'"]([^\'"]+)[\'"]', content)
    if url_matches:
        data_sources['dataUrl'] = url_matches[0]
    
    # Look for inline data arrays
    inline_data_pattern = r'data\d*\s*=\s*(\[[\s\S]*?\])'
    inline_matches = re.findall(inline_data_pattern, content)
    
    for idx, match in enumerate(inline_matches, 1):
        try:
            # Clean up the JavaScript object notation to make it valid JSON
            cleaned_data = re.sub(r'(\w+):', r'"\1":', match)  # Add quotes to property names
            cleaned_data = re.sub(r'([^\\]|^)\'', r'\1"', cleaned_data)  # Replace single quotes with double quotes
            data_sources[f'data{idx}'] = json.loads(cleaned_data)
        except json.JSONDecodeError as e:
            print(f"Warning: Could not parse inline data{idx} in {js_file}: {str(e)}")
    
    return data_sources

def download_data(url):
    """Download data from URL to a temporary file."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Create temporary file with appropriate extension
        ext = '.csv' if 'csv' in url.lower() else '.json'
        temp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
        temp.write(response.content)
        temp.close()
        return temp.name
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")
        return None

def analyze_data(data_path):
    """Run report_data utility on the data file."""
    try:
        result = subprocess.run([REPORT_DATA_PATH, data_path], 
                              capture_output=True, 
                              text=True)
        return result.stdout
    except Exception as e:
        return f"Error analyzing data: {str(e)}"

def process_visualization(viz_dir, infer=False, force_openai=False, failed_inferences=None, temperature=0):
    """Process a single visualization directory."""
    if failed_inferences is None:
        failed_inferences = []
        
    js_files = list(Path(viz_dir).glob('*.js'))
    if not js_files:
        print(f"No JavaScript files found in {viz_dir}")
        return

    for js_file in js_files:
        print(f"\nAnalyzing {js_file}...")
        data_sources = extract_data(js_file)

        if not data_sources or force_openai:
            if not data_sources:
                print("No data sources found in the JavaScript file.")
            if infer or force_openai:
                print("\nInferring data structure using OpenAI...")
                try:
                    inferer = D3DataInferer()
                    result = inferer.infer_data_structure(str(js_file), temperature=temperature)
                    
                    # Save inferred sample data
                    sample_data_path = js_file.parent / 'inferred_sample_data.json'
                    inferer.save_sample_data(result['sample_data'], sample_data_path)
                    
                    # Save explanation separately
                    explanation_path = js_file.parent / 'explanation.txt'
                    explanation_content = [
                        "D3 Visualization Data Structure Inference",
                        "=" * 50,
                        f"\nData Structure:",
                        "-" * 20,
                        result['data_structure'],
                        f"\nDetailed Explanation:",
                        "-" * 20,
                        result['explanation']
                    ]
                    with open(explanation_path, 'w') as f:
                        f.write('\n'.join(explanation_content))
                    
                    print(f"\nExplanation saved to: {explanation_path}")
                    print(f"Sample data saved to: {sample_data_path}")
                    
                    # Generate data report for the sample data
                    inferred_report_path = js_file.parent / 'inferred_data_report.txt'
                    report_content = [
                        f"\nInferred Sample Data Analysis",
                        "=" * 50,
                        analyze_data(str(sample_data_path))
                    ]
                    
                    # Write report
                    with open(inferred_report_path, 'w') as f:
                        f.write('\n'.join(report_content))
                    print(f"Inferred data analysis report written to: {inferred_report_path}")
                    
                except Exception as e:
                    error_msg = str(e)
                    print(f"Error inferring data structure: {error_msg}")
                    
                    # Save the failed response
                    if hasattr(e, 'response_content'):
                        failed_parse_path = js_file.parent / 'failed_to_parse.txt'
                        with open(failed_parse_path, 'w') as f:
                            f.write(str(e.response_content))
                        print(f"Failed response saved to: {failed_parse_path}")
                    
                    # Track the failure
                    failed_inferences.append({
                        'file': str(js_file),
                        'error': error_msg,
                        'has_data': bool(data_sources)
                    })
                    
            if not force_openai:
                continue

        if data_sources:
            print(f"\nProcessing {js_file.parent.name}...")
            
            # Prepare report file path
            report_path = js_file.parent / 'data_report.txt'
            report_content = []
            
            # Process each data source
            for source_name, data in data_sources.items():
                print(f"Found {source_name}")
                
                if source_name == 'dataUrl':
                    # Handle remote URL
                    if data.startswith('http'):
                        temp_file = download_data(data)
                        if temp_file:
                            source_report = analyze_data(temp_file)
                            os.unlink(temp_file)
                    else:
                        # For local files, look in the same directory
                        local_path = js_file.parent / data
                        if local_path.exists():
                            source_report = analyze_data(str(local_path))
                        else:
                            source_report = f"Local file not found: {data}"
                else:
                    # Handle inline data
                    temp_file = js_file.parent / f'{source_name}.json'
                    try:
                        with open(temp_file, 'w') as f:
                            json.dump(data, f, indent=2)
                        source_report = analyze_data(str(temp_file))
                        os.unlink(temp_file)  # Clean up temp file
                    except Exception as e:
                        source_report = f"Error analyzing inline data: {str(e)}"
                
                # Add to report
                report_content.extend([
                    f"\nData Source: {source_name}",
                    "=" * 50,
                    source_report if source_report else "No data analysis available"
                ])
            
            # Write complete report
            with open(report_path, 'w') as f:
                f.write('\n'.join(report_content))
            
            print(f"Original data analysis report written to: {report_path}")

def main():
    parser = argparse.ArgumentParser(description='Analyze D3 visualization data files')
    parser.add_argument('--dir', '-d', help='Directory containing D3 visualizations', default=D3_GALLERY_PATH)
    parser.add_argument('--infer', '-i', action='store_true', help='Use OpenAI to infer data structure when data is unavailable')
    parser.add_argument('--force-open-ai', '-f', action='store_true', help='Force OpenAI inference for all JS files, even if they have data')
    parser.add_argument('--temperature', '-t', type=float, default=0, help='OpenAI temperature parameter (default: 0)')
    args = parser.parse_args()

    if not os.path.isdir(args.dir):
        print(f"Error: {args.dir} is not a directory")
        sys.exit(1)

    # Track failed inferences
    failed_inferences = []
    
    for viz_dir in sorted(Path(args.dir).iterdir()):
        if viz_dir.is_dir():
            process_visualization(viz_dir, infer=args.infer, force_openai=args.force_open_ai, 
                               failed_inferences=failed_inferences, temperature=args.temperature)

    # Report failures if any occurred
    if failed_inferences:
        print("\n" + "=" * 80)
        print("FAILED INFERENCES SUMMARY")
        print("=" * 80)
        
        # Save failure report
        report_path = Path(args.dir) / 'failed_inferences_report.txt'
        with open(report_path, 'w') as f:
            f.write("FAILED INFERENCES SUMMARY\n")
            f.write("=" * 80 + "\n\n")
            
            for failure in failed_inferences:
                msg = f"File: {failure['file']}\n"
                msg += f"Error: {failure['error']}\n"
                msg += f"Has existing data: {'Yes' if failure['has_data'] else 'No'}\n"
                msg += "-" * 40 + "\n"
                
                print(msg)
                f.write(msg + "\n")
                
        print(f"\nFailed inferences report saved to: {report_path}")
        print(f"Total failures: {len(failed_inferences)}")

if __name__ == "__main__":
    main()
