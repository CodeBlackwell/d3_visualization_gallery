#!/usr/bin/env python

import os
import json
from pathlib import Path

D3_GALLERY_PATH = "/home/juke/t5d3/root_resources/d3_gallery_downloads"
OUTPUT_FILE = "./d3_training_data.json"

def generate_training_data():
    training_data = []

    for subdir in Path(D3_GALLERY_PATH).iterdir():
        if subdir.is_dir():
            queries_file = subdir / 'queries.json'
            js_files = list(subdir.glob('*.js'))
            if queries_file.exists() and js_files:
                with open(queries_file, 'r') as qf:
                    queries = json.load(qf).get('queries', [])
                js_content = js_files[0].read_text()

                for query in queries:
                    training_data.append({
                        "input": query['query'],
                        "instruct": "",
                        "output": js_content
                    })

    with open(OUTPUT_FILE, 'w') as outfile:
        json.dump(training_data, outfile, indent=2)

if __name__ == "__main__":
    generate_training_data()
