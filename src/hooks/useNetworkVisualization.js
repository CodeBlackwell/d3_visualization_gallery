import { useCallback } from 'react';
import * as d3 from 'd3';
import { NETWORK_CONFIG } from '../constants/visualizationConfig';

const useNetworkVisualization = () => {
  const createVisualization = useCallback(async (containerRef, config) => {
    try {
      const container = d3.select(containerRef);
      if (!container) {
        throw new Error('No container provided');
      }

      if (!config?.dataUrl) {
        throw new Error('No data URL provided in configuration');
      }

      // Load the network data
      const response = await fetch(config.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Clear previous content
      container.selectAll('*').remove();

      const { margin, width, height } = NETWORK_CONFIG.dimensions;

      // Create the SVG container
      const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // List of node names and groups
      const allNodes = data.nodes.map(d => d.name);
      const allGroups = [...new Set(data.nodes.map(d => d.grp))];

      // Scales
      const color = d3.scaleOrdinal()
        .domain(allGroups)
        .range(d3.schemeSet3);

      const size = d3.scaleLinear()
        .domain([1, 10])
        .range([2, 10]);

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
        .attr('stroke', NETWORK_CONFIG.styles.link.defaultColor)
        .style('stroke-width', NETWORK_CONFIG.styles.link.defaultWidth);

      // Add the nodes
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

      // Add labels
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
        .style('font-size', NETWORK_CONFIG.styles.label.defaultSize);

      // Add interactions
      nodes
        .on('mouseover', function (event, d) {
          nodes.style('opacity', NETWORK_CONFIG.styles.node.dimmedOpacity);
          d3.select(this).style('opacity', NETWORK_CONFIG.styles.node.defaultOpacity);

          links
            .style('stroke', link_d => link_d.source === d.id || link_d.target === d.id ? color(d.grp) : NETWORK_CONFIG.styles.link.highlightColor)
            .style('stroke-opacity', link_d => link_d.source === d.id || link_d.target === d.id ? 1 : 0.2)
            .style('stroke-width', link_d => link_d.source === d.id || link_d.target === d.id ? NETWORK_CONFIG.styles.link.highlightWidth : NETWORK_CONFIG.styles.link.defaultWidth);

          labels
            .style('font-size', label_d => label_d.name === d.name ? NETWORK_CONFIG.styles.label.highlightSize : NETWORK_CONFIG.styles.label.defaultSize)
            .attr('y', label_d => label_d.name === d.name ? 10 : 0);
        })
        .on('mouseout', function () {
          nodes.style('opacity', NETWORK_CONFIG.styles.node.defaultOpacity);
          links
            .style('stroke', NETWORK_CONFIG.styles.link.defaultColor)
            .style('stroke-opacity', 0.8)
            .style('stroke-width', NETWORK_CONFIG.styles.link.defaultWidth);
          labels.style('font-size', NETWORK_CONFIG.styles.label.defaultSize);
        });

    } catch (error) {
      console.error('Error creating network visualization:', error);
      const container = d3.select(containerRef);
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
  }, []);

  return { createVisualization };
};

export default useNetworkVisualization;
