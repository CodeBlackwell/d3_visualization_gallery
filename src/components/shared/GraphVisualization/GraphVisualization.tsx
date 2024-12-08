import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './GraphVisualization.css';

interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Edge {
  source: string;
  target: string;
}

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
  highlightedNode?: string | null;
  visitedNodes?: Set<string>;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  width = 600,
  height = 400,
  highlightedNode = null,
  visitedNodes = new Set()
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous contents
    d3.select(svgRef.current).selectAll('*').remove();

    // Construct SimulationLinkDatum array
    const edgesWithNodes: d3.SimulationLinkDatum<Node>[] = edges.map(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);

      if (!sourceNode || !targetNode) {
        throw new Error(`Invalid edge: ${edge.source} -> ${edge.target}`);
      }

      // Cast is safe since we know nodes are defined
      return { source: sourceNode, target: targetNode };
    });

    // Create the simulation with generics
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, d3.SimulationLinkDatum<Node>>(edgesWithNodes).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current as SVGSVGElement);

    // Typing the selections
    const links = svg.append('g')
      .selectAll<SVGLineElement, d3.SimulationLinkDatum<Node>>('line')
      .data(edgesWithNodes)
      .join('line')
      .attr('class', 'graph-edge');

    const nodeGroups = svg.append('g')
      .selectAll<SVGGElement, Node>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'graph-node')
      // Ensure drag event typings align with Node
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event: d3.D3DragEvent<SVGGElement, Node, Node>, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: d3.D3DragEvent<SVGGElement, Node, Node>, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: d3.D3DragEvent<SVGGElement, Node, Node>, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    nodeGroups.append('circle')
      .attr('r', 10)
      .attr('class', 'node-circle')
      .style('fill', d => {
        if (d.id === highlightedNode) return '#ff6b6b';  // Highlighted node
        if (visitedNodes.has(d.id)) return '#a8e6cf';    // Visited node
        return '#4a4a4a';                                // Default color
      });

    nodeGroups.append('text')
      .text(d => d.label)
      .attr('dx', 15)
      .attr('dy', 5)
      .attr('class', 'node-label');

    simulation.on('tick', () => {
      links
        .attr('x1', d => ((d.source as Node).x ?? 0))
        .attr('y1', d => ((d.source as Node).y ?? 0))
        .attr('x2', d => ((d.target as Node).x ?? 0))
        .attr('y2', d => ((d.target as Node).y ?? 0));

      nodeGroups.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height, highlightedNode, visitedNodes]);

  return (
    <div className="graph-visualization">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default GraphVisualization;
