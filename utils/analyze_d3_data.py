#!/usr/bin/env python3

import os
import re
import json
import subprocess
import requests
import tempfile
from pathlib import Path

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

def process_visualization(viz_dir):
    """Process a single visualization directory."""
    js_files = list(Path(viz_dir).glob('*.js'))
    if not js_files:
        return
    
    js_file = js_files[0]  # Take the first JS file
    data_sources = extract_data(js_file)
    
    if not data_sources:
        return
    
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
    
    print(f"Report written to: {report_path}")

def main():
    """Main function to process all visualizations."""
    gallery_path = Path(D3_GALLERY_PATH)
    
    # Process each visualization directory
    for viz_dir in gallery_path.iterdir():
        if viz_dir.is_dir():
            process_visualization(viz_dir)

if __name__ == "__main__":
    main()
