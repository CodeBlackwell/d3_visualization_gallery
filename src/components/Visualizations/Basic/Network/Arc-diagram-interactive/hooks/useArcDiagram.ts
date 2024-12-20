import { useCallback } from 'react';
import * as d3 from 'd3';
import { Visualization } from '../../../../../../types/visualization';

interface Node {
  id: string;
  name: string;
  grp: string;
  n: number;
}

interface Link {
  source: string;
  target: string;
}

interface NetworkData {
  nodes: Node[];
  links: Link[];
}

interface ExtendedVisualization extends Visualization {
  dimensions?: {
    margin: { top: number; right: number; bottom: number; left: number };
    width: number;
    height: number;
  };
  styles?: {
    link: {
      defaultColor: string;
      highlightColor: string;
      defaultWidth: number;
      highlightWidth: number;
    };
    node: {
      defaultOpacity: number;
      dimmedOpacity: number;
    };
    label: {
      defaultSize: number;
      highlightSize: number;
    };
  };
}

const useArcDiagram = () => {
  const createVisualization = useCallback(async (containerRef: HTMLDivElement, config: ExtendedVisualization) => {
    console.log('Creating visualization with config:', config);
    console.log('Container dimensions:', {
      width: containerRef.clientWidth,
      height: containerRef.clientHeight
    });

    try {
      // Show loading indicator
      const loadingIndicator = containerRef.querySelector('.loading-indicator');
      if (loadingIndicator) {
        (loadingIndicator as HTMLElement).style.display = 'block';
      }

      const container = d3.select(containerRef);
      console.log('D3 container selection:', container.node());

      if (!container.node()) {
        throw new Error('No container provided');
      }

      if (!config?.dataUrl) {
        throw new Error('No data URL provided in configuration');
      }

      console.log('Fetching data from:', config.dataUrl);
      // Load the network data
      const response = await fetch(config.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: NetworkData = await response.json();
      console.log('Loaded data:', {
        nodeCount: data.nodes.length,
        linkCount: data.links.length
      });

      // Clear previous content
      container.selectAll('*').remove();

      // Get container dimensions
      const containerWidth = containerRef.clientWidth;
      const containerHeight = containerRef.clientHeight;

      const { margin } = config.dimensions || {
        margin: { top: 0, right: 30, bottom: 50, left: 60 }
      };

      // Use container dimensions instead of fixed values
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      console.log('Using dimensions:', { margin, width, height });

      // Create the SVG container with viewBox for responsiveness
      const svg = container
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      console.log('Created SVG container:', svg.node());

      // List of node names and groups
      const allNodes = data.nodes.map(d => d.name);
      const allGroups = [...new Set(data.nodes.map(d => d.grp))];
      console.log('Unique groups:', allGroups);

      // Scales
      const color = d3.scaleOrdinal<string>()
        .domain(allGroups)
        .range(d3.schemeSet3);

      const size = d3.scaleLinear()
        .domain([1, 10])
        .range([2, 10]);

      const x = d3.scalePoint()
        .range([0, width])
        .domain(allNodes);

      // Create an id to node mapping
      const idToNode: { [key: string]: Node } = {};
      data.nodes.forEach(n => {
        idToNode[n.id] = n;
      });

      const styles = config.styles || {
        link: {
          defaultColor: 'grey',
          highlightColor: '#b8b8b8',
          defaultWidth: 1,
          highlightWidth: 4
        },
        node: {
          defaultOpacity: 1,
          dimmedOpacity: 0.2
        },
        label: {
          defaultSize: 6,
          highlightSize: 16
        }
      };

      // Add the links
      console.log('Creating links...');
      const links = svg
        .selectAll('path.link')
        .data(data.links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => {
          const start = x(idToNode[d.source].name) || 0;
          const end = x(idToNode[d.target].name) || 0;
          return ['M', start, height - 30,
                  'A',
                  (start - end) / 2, ',',
                  (start - end) / 2, 0, 0, ',',
                  start < end ? 1 : 0, end, ',',
                  height - 30
                ].join(' ');
        })
        .style('fill', 'none')
        .attr('stroke', styles.link.defaultColor)
        .style('stroke-width', styles.link.defaultWidth);

      console.log('Created links:', links.size());

      // Add the nodes
      console.log('Creating nodes...');
      const nodes = svg
        .selectAll('circle.node')
        .data(data.nodes.sort((a, b) => +b.n - +a.n))
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', d => x(d.name) || 0)
        .attr('cy', height - 30)
        .attr('r', d => size(d.n))
        .style('fill', d => color(d.grp))
        .attr('stroke', 'white');

      console.log('Created nodes:', nodes.size());

      // Add labels
      console.log('Creating labels...');
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
        .attr('transform', d => `translate(${x(d.name) || 0}, ${height - 15})rotate(-45)`)
        .style('font-size', styles.label.defaultSize);

      console.log('Created labels:', labels.size());

      // Add interactions
      nodes
        .on('mouseover', function(this: SVGCircleElement, event: MouseEvent, d: Node) {
          // Get all connected node IDs
          const connectedNodes = new Set<string>();
          connectedNodes.add(d.id);
          
          // Find all connected nodes through links
          data.links.forEach(link => {
            if (link.source === d.id) {
              connectedNodes.add(link.target);
            } else if (link.target === d.id) {
              connectedNodes.add(link.source);
            }
          });

          // Dim unconnected nodes
          nodes.style('opacity', (node_d: Node) => 
            connectedNodes.has(node_d.id) ? styles.node.defaultOpacity : styles.node.dimmedOpacity
          );
          
          // Keep hovered node fully visible
          d3.select(this).style('opacity', styles.node.defaultOpacity);

          // Highlight connected links
          links
            .style('stroke', (link_d: Link) => {
              const isConnected = link_d.source === d.id || link_d.target === d.id;
              return isConnected ? color(d.grp) : styles.link.highlightColor;
            })
            .style('stroke-opacity', (link_d: Link) => 
              (link_d.source === d.id || link_d.target === d.id) ? 1 : 0.2
            )
            .style('stroke-width', (link_d: Link) => 
              (link_d.source === d.id || link_d.target === d.id) ? 
                styles.link.highlightWidth : styles.link.defaultWidth
            );

          // Highlight connected labels and dim others
          labels
            .style('font-size', (label_d: Node) => 
              label_d.id === d.id ? styles.label.highlightSize : styles.label.defaultSize
            )
            .style('opacity', (label_d: Node) => 
              connectedNodes.has(label_d.id) ? 1 : 0.2
            )
            .attr('y', (label_d: Node) => 
              label_d.id === d.id ? 10 : 0
            );
        })
        .on('mouseout', function() {
          // Reset all elements to default state
          nodes.style('opacity', styles.node.defaultOpacity);
          
          links
            .style('stroke', styles.link.defaultColor)
            .style('stroke-opacity', 0.8)
            .style('stroke-width', styles.link.defaultWidth);
          
          labels
            .style('font-size', styles.label.defaultSize)
            .style('opacity', 1)
            .attr('y', 0);
        });

      // Hide loading indicator
      if (loadingIndicator) {
        (loadingIndicator as HTMLElement).style.display = 'none';
      }

      console.log('Visualization creation completed successfully');

    } catch (error) {
      console.error('Error creating arc diagram:', error);
      const container = d3.select(containerRef);
      if (container) {
        container.html('');
        container
          .append('div')
          .attr('class', 'error-message')
          .style('color', 'red')
          .style('text-align', 'center')
          .style('padding', '20px')
          .text(`Error loading visualization: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Hide loading indicator on error
      const loadingIndicator = containerRef.querySelector('.loading-indicator');
      if (loadingIndicator) {
        (loadingIndicator as HTMLElement).style.display = 'none';
      }
    }
  }, []);

  return { createVisualization };
};

export default useArcDiagram;
