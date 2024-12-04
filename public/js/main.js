import * as d3 from 'd3';
import { createVolcanoMap, metadata as volcanoMetadata } from '../../visualizations/map/contour/volcano_contours_2/volcano_contours_2.js';
import { createLetterFrequencyChart, metadata as letterFrequencyMetadata } from '../../visualizations/bar/bar-chart/letter_frequency.js';
import { createNetworkVisualization, metadata as networkMetadata } from '../../visualizations/diagram/arc-diagram/arc-diagram.js';

// Available visualizations with their metadata
const visualizations = {
    'network-diagram': {
        create: createNetworkVisualization,
        metadata: networkMetadata
    },
    'volcano-contours': {
        create: createVolcanoMap,
        metadata: volcanoMetadata
    },
    'letter-frequency': {
        create: createLetterFrequencyChart,
        metadata: letterFrequencyMetadata
    },
    
    // Add more visualizations here as we create them
};

// Add global styles
const globalStyles = `
    body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #menu {
        background: #f5f5f5;
        padding: 1rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .menu-container {
        width: 50%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        min-width: 200px;
    }
    .description {
        color: #666;
        font-size: 0.9rem;
    }
    #visualization {
        padding: 1rem;
    }
`;

// Create a visualization selector
function createVisSelector() {
    // Add global styles if they don't exist
    if (!document.getElementById('global-style')) {
        const style = document.createElement('style');
        style.id = 'global-style';
        style.textContent = globalStyles;
        document.head.appendChild(style);
    }
    
    // Create menu if it doesn't exist
    let menu = d3.select('#menu');
    if (menu.empty()) {
        menu = d3.select('body')
            .insert('div', '#visualization')
            .attr('id', 'menu');

        const menuContainer = menu
            .append('div')
            .attr('class', 'menu-container');

        // Add the dropdown
        menuContainer
            .append('select')
            .on('change', function() {
                showVisualization(this.value).catch(error => {
                    console.error('Error showing visualization:', error);
                });
            })
            .selectAll('option')
            .data(Object.entries(visualizations))
            .join('option')
            .attr('value', d => d[0])
            .text(d => d[1].metadata.name);

        // Add the description
        menuContainer
            .append('span')
            .attr('class', 'description');
    }
}

// Function to show a specific visualization
async function showVisualization(visId) {
    const vis = visualizations[visId];
    if (!vis) return;

    // Update description
    d3.select('.description').text(vis.metadata.description);

    // Update the visualization container
    const container = d3.select('#visualization');
    
    // Clear existing content and styles
    container.selectAll('*').remove();
    const existingStyle = document.getElementById('visualization-style');
    if (existingStyle) existingStyle.remove();

    // Add the visualization's HTML
    container.html(vis.metadata.html);

    // Add the visualization's CSS
    const style = document.createElement('style');
    style.id = 'visualization-style';
    style.textContent = vis.metadata.css;
    document.head.appendChild(style);

    // Create the visualization
    await vis.create(container);
}

// Initialize the visualization selector and show the first visualization
createVisSelector();
const firstVisId = Object.keys(visualizations)[0];
if (firstVisId) {
    showVisualization(firstVisId).catch(error => {
        console.error('Error showing visualization:', error);
    });
}

// Hot Module Replacement
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        const currentSelection = d3.select('#menu select').property('value');
        createVisSelector();
        showVisualization(currentSelection);
    });
}
