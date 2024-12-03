# Observable Notebook to Windsurf Visualization Translation Guide

## Overview
This guide outlines the process of converting Observable notebooks into Windsurf-compatible visualizations. The goal is to maintain visualization functionality while adapting it to our structured format.

## Step 1: Initial Analysis
1. **Identify Key Components**
   - Main visualization function
   - Data loading mechanism
   - Dependencies (especially D3.js modules)
   - Interactive elements
   - Styling

2. **Review Data Structure**
   - Data file format
   - Data loading method
   - Required transformations
   - Data validation needs

## Step 2: Create Directory Structure
```
visualization_name/
├── prompt.json
├── visualization_name.js
└── data/
    └── source_data.json
```

## Step 3: Generate prompt.json
Key sections to include:

```json
{
    "inputs": [
        "Primary task description with {placeholders}",
        "Alternative description focusing on data structure",
        "Detailed description including technical requirements"
    ],
    "output": {
        "config": {
            "visualizationName": "",
            "description": "",
            "containerId": "",
            "dimensions": {},
            "styling": {},
            "visualization": {
                "colorFunction": "",
                "strokeSettings": "",
                "scales": [],
                "axes": [],
                "legend": {}
            }
        }
    }
}
```

### Important Considerations for prompt.json:
1. Use clear, descriptive placeholders
2. Include all configurable parameters
3. Provide sufficient variation in input descriptions
4. Maintain consistent naming conventions

## Step 4: Create Visualization Module

### Essential Components:
```javascript
// metadata export
export const metadata = {
    name: '',
    description: '',
    html: ``,
    css: ``
};

// main visualization function
export async function createVisualization(container) {
    // 1. Data loading
    // 2. Container setup
    // 3. Visualization creation
    // 4. Interactivity
    // 5. Legend/labels
}

// HMR support
if (import.meta.hot) {
    import.meta.hot.accept();
}
```

### Key Aspects to Transfer:
1. **Data Loading**
   - Convert Observable FileAttachment to direct file loading
   - Update data paths to match new structure
   - Add error handling

2. **D3 Selections**
   - Replace Observable's selection methods
   - Use container-based selections
   - Maintain proper scoping

3. **Styling**
   - Move inline styles to CSS
   - Use class-based styling
   - Ensure responsive design

4. **Interactivity**
   - Convert Observable's reactive cells to event listeners
   - Maintain interactive features
   - Add proper cleanup

## Step 5: Testing & Validation

### Test Cases:
1. Data loading works correctly
2. Visualization renders properly
3. Responsive behavior functions
4. Interactive features work
5. Styles apply correctly
6. Error handling works

### Common Issues to Check:
- Missing dependencies
- Incorrect data paths
- Scope issues with D3 selections
- Style conflicts
- Memory leaks in interactive features

## Step 6: Documentation

### Include:
1. Brief description of original notebook
2. Key modifications made
3. Dependencies
4. Usage instructions
5. Configuration options
6. Known limitations

## Example Translation

### Original Observable:
```javascript
function _chart(data,d3) {
  // visualization code
}
```

### Windsurf Version:
```javascript
export async function createVisualization(container) {
  const data = await d3.json('/data/source.json');
  // visualization code
}
```

## Common Pitfalls
1. Not handling async data loading properly
2. Missing cleanup in interactive visualizations
3. Hardcoded dimensions/styling
4. Insufficient error handling
5. Incomplete dependency documentation

## Checklist for Review
- [ ] All dependencies identified and included
- [ ] Data loading works and handles errors
- [ ] Visualization renders correctly
- [ ] Interactive features working
- [ ] Responsive design implemented
- [ ] Styles properly organized
- [ ] Documentation complete
- [ ] Error handling comprehensive
- [ ] Memory leaks addressed
- [ ] Tests passing

## Tips for Success
1. Always test with different data sizes
2. Check mobile responsiveness
3. Verify all interactive features
4. Document any assumptions
5. Include error states
6. Test performance with large datasets
7. Verify cleanup on unmount

Remember: The goal is to maintain the visualization's functionality while adapting it to our structured format. Focus on modularity, reusability, and maintainability in the translation process.
