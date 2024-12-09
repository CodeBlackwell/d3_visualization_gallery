import { GRAPH_ALGORITHMS } from '../components/DataStructures/Graph/UndirectedGraph/config';

export const DATA_STRUCTURES = {
  graph: {
    id: 'graph',
    name: 'Graphs',
    types: {
      undirected: {
        id: 'undirected',
        name: 'Undirected Graph',
        algorithms: GRAPH_ALGORITHMS,
        path: '/datastructures/graph/undirected'
      },
      directed: {
        id: 'directed',
        name: 'Directed Graph',
        algorithms: GRAPH_ALGORITHMS,  // We'll use the same algorithms for now
        path: '/datastructures/graph/directed'
      }
    }
  }
  // Add more data structure categories here (trees, heaps, etc.)
} as const;

export type DataStructureType = keyof typeof DATA_STRUCTURES;
export type GraphType = keyof typeof DATA_STRUCTURES.graph.types;
