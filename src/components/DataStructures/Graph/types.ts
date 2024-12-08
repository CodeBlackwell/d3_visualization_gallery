import { DataStructureBase } from '../types';

export interface GraphNode {
  id: string;
  label: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphDataStructure extends DataStructureBase {
  type: 'graph';
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type GraphTraversalSequence = string[];
