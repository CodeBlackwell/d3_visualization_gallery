import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import './GraphVisualization.css';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  x?: number;
  y?: number;
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
  const simulationRef = useRef<d3.Simulation<Node, d3.SimulationLinkDatum<Node>> | null>(null);
  
  // Memoize the graph structure setup
  const graphData = useMemo(() => {
    const edgesWithNodes: d3.SimulationLinkDatum<Node>[] = edges.map(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);

      if (!sourceNode || !targetNode) {
        throw new Error(`Invalid edge: ${edge.source} -> ${edge.target}`);
      }

      return { source: sourceNode, target: targetNode };
    });

    return { nodes, edgesWithNodes };
  }, [nodes, edges]);

  // Setup the graph structure once
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous contents
    d3.select(svgRef.current).selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(graphData.nodes)
      .force('link', d3.forceLink<Node, d3.SimulationLinkDatum<Node>>(graphData.edgesWithNodes).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current);

    const links = svg.append('g')
      .selectAll<SVGLineElement, d3.SimulationLinkDatum<Node>>('line')
      .data(graphData.edgesWithNodes)
      .join('line')
      .attr('class', 'graph-edge');

    const nodeGroups = svg.append('g')
      .selectAll<SVGGElement, Node>('g')
      .data(graphData.nodes)
      .join('g')
      .attr('class', 'graph-node')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    nodeGroups.append('circle')
      .attr('r', 10)
      .attr('class', 'node-circle');

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

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [graphData, width, height]);

  // Update only node colors when highlighting changes
  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current)
      .selectAll('.node-circle')
      .style('fill', (d: any) => {
        if (d.id === highlightedNode) return '#ff6b6b';
        if (visitedNodes.has(d.id)) return '#a8e6cf';
        return '#4a4a4a';
      });
  }, [highlightedNode, visitedNodes]);

  return (
    <div className="graph-visualization">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default React.memo(GraphVisualization);
