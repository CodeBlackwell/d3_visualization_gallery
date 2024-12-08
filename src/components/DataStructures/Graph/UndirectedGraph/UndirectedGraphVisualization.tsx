import React from 'react';
import GraphVisualization from '../../../shared/GraphVisualization/GraphVisualization';
import { GraphNode, GraphEdge } from '../types';

interface UndirectedGraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  highlightedNode?: string;
  visitedNodes: Set<string>;
}

const UndirectedGraphVisualization: React.FC<UndirectedGraphVisualizationProps> = ({
  nodes,
  edges,
  width,
  height,
  highlightedNode,
  visitedNodes
}) => {
  return (
    <GraphVisualization
      nodes={nodes}
      edges={edges}
      width={width}
      height={height}
      highlightedNode={highlightedNode}
      visitedNodes={visitedNodes}
    />
  );
};

export default UndirectedGraphVisualization;
