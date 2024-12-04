import * as d3 from 'd3';

export const metadata = {
    name: 'Network Visualization',
    description: 'Network visualization of researcher connections using D3.js',
    html: `
        <div class="visualization-container">
            <div id="network-map"></div>
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
        #network-map {
            width: 100%;
            height: 100%;
        }
        #network-map svg {
            display: block;
            margin: 0 auto;
        }
    `
};

export async function createNetworkVisualization(container) {
    try {
        if (!container) {
            throw new Error('No container provided');
        }

        // Load the network data from GitHub
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_researcherNetwork.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Get the specific container for this visualization
        const visContainer = container.select('#network-map');
        if (!visContainer.node()) {
            throw new Error('Network map container not found');
        }

        visContainer.selectAll('*').remove();

        const margin = { top: 0, right: 30, bottom: 50, left: 60 },
              width = 650 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;

        // Create the SVG container
        const svg = visContainer
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // List of node names and groups
        const allNodes = data.nodes.map(d => d.name);
        const allGroups = [...new Set(data.nodes.map(d => d.grp))];

        // A color scale for groups
        const color = d3.scaleOrdinal()
            .domain(allGroups)
            .range(d3.schemeSet3);

        // A linear scale for node size
        const size = d3.scaleLinear()
            .domain([1, 10])
            .range([2, 10]);

        // A linear scale to position the nodes on the X axis
        const x = d3.scalePoint()
            .range([0, width])
            .domain(allNodes);

        // Create an id to node mapping
        const idToNode = {};
        data.nodes.forEach(n => {
            idToNode[n.id] = n;
        });

        // Add the links
        const links = svg
            .selectAll('path.link')
            .data(data.links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d => {
                const start = x(idToNode[d.source].name);
                const end = x(idToNode[d.target].name);
                return ['M', start, height - 30, 
                        'A', 
                        (start - end) / 2, ',', 
                        (start - end) / 2, 0, 0, ',',
                        start < end ? 1 : 0, end, ',', 
                        height - 30
                      ].join(' ');
            })
            .style('fill', 'none')
            .attr('stroke', 'grey')
            .style('stroke-width', 1);

        // Add the nodes as circles
        const nodes = svg
            .selectAll('circle.node')
            .data(data.nodes.sort((a, b) => +b.n - +a.n))
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('cx', d => x(d.name))
            .attr('cy', height - 30)
            .attr('r', d => size(d.n))
            .style('fill', d => color(d.grp))
            .attr('stroke', 'white');

        // Add labels to the nodes
        const labels = svg
            .selectAll('text.label')
            .data(data.nodes)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', 0)
            .attr('y', 0)
            .text(d => d.name)
            .style('text-anchor', 'end')
            .attr('transform', d => `translate(${x(d.name)}, ${height - 15})rotate(-45)`)
            .style('font-size', 6);

        // Add highlighting functionality
        nodes
            .on('mouseover', function (event, d) {
                nodes.style('opacity', 0.2);
                d3.select(this).style('opacity', 1);

                links
                    .style('stroke', link_d => link_d.source === d.id || link_d.target === d.id ? color(d.grp) : '#b8b8b8')
                    .style('stroke-opacity', link_d => link_d.source === d.id || link_d.target === d.id ? 1 : 0.2)
                    .style('stroke-width', link_d => link_d.source === d.id || link_d.target === d.id ? 4 : 1);

                labels
                    .style('font-size', label_d => label_d.name === d.name ? 16 : 2)
                    .attr('y', label_d => label_d.name === d.name ? 10 : 0);
            })
            .on('mouseout', function () {
                nodes.style('opacity', 1);
                links
                    .style('stroke', 'grey')
                    .style('stroke-opacity', 0.8)
                    .style('stroke-width', 1);
                labels.style('font-size', 6);
            });

    } catch (error) {
        console.error('Error creating network visualization:', error);
        if (container) {
            container.html('');
            container
                .append('div')
                .attr('class', 'error-message')
                .style('color', 'red')
                .style('text-align', 'center')
                .style('padding', '20px')
                .text(`Error loading visualization: ${error.message}`);
        }
    }
}

// Initial creation
createNetworkVisualization(d3.select('#visualization'));

// Hot Module Replacement
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        createNetworkVisualization(d3.select('#visualization'));
    });
}