import * as d3 from 'd3';

export const metadata = {
    name: 'Volcano Contours',
    description: 'Topographic visualization of Maungawhau volcano using contour lines',
    html: `
        <div class="visualization-container">
            <div id="volcano-map"></div>
        </div>
    `,
    css: `
        .visualization-container {
            width: 50%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #volcano-map {
            width: 100%;
            height: 100%;
        }
        #volcano-map svg {
            display: block;
            margin: 0 auto;
        }
    `
};

export async function createVolcanoMap(container) {
    // Load the volcano data
    const data = await d3.json('/data/volcano-contours_2/volcano.json');
    
    // Get the specific container for this visualization
    const visContainer = container.select('#volcano-map');
    visContainer.selectAll('*').remove();

    const n = data.width;
    const m = data.height;
    const width = 928;
    const height = Math.round(m / n * width);

    // Create the SVG container
    const svg = visContainer
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    // Set up the path generator and contours
    const path = d3.geoPath()
        .projection(d3.geoIdentity().scale(width / n));
    
    const contours = d3.contours()
        .size([n, m]);

    // Create a color scale
    const color = d3.scaleSequential(d3.interpolateTurbo)
        .domain(d3.extent(data.values))
        .nice();

    // Draw the contours
    svg.append('g')
        .attr('stroke', 'black')
        .selectAll('path')
        .data(color.ticks(20))
        .join('path')
        .attr('d', d => path(contours.contour(data.values, d)))
        .attr('fill', color);

    // Add a color legend
    const legendWidth = 200;
    const legendHeight = 20;
    const marginRight = 50;
    
    const legend = svg.append('g')
        .attr('transform', `translate(${width - legendWidth - marginRight}, 20)`);

    // Create gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'legend-gradient')
        .attr('x1', '0%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '0%');

    // Add color stops
    const colorRange = color.domain();
    const step = (colorRange[1] - colorRange[0]) / 10;
    for (let i = 0; i <= 10; i++) {
        const value = colorRange[0] + step * i;
        gradient.append('stop')
            .attr('offset', `${i * 10}%`)
            .attr('stop-color', color(value));
    }

    // Draw the legend rectangle
    legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#legend-gradient)');

    // Add legend axis
    const legendScale = d3.scaleLinear()
        .domain(color.domain())
        .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d => `${d}m`);

    legend.append('g')
        .attr('transform', `translate(0, ${legendHeight})`)
        .call(legendAxis);

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Maungawhau Volcano Topography');
}

// Initial creation
createVolcanoMap(d3.select('#visualization'));

// Hot Module Replacement
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        createVolcanoMap(d3.select('#visualization'));
    });
}
