import { Algorithm } from '../../types';
import { GraphDataStructure } from '../types';

export const UNDIRECTED_GRAPH: GraphDataStructure = {
  type: 'graph',
  name: 'Undirected Graph',
  description: 'A graph is a non-linear data structure consisting of vertices (nodes) and edges that connect these vertices. In this visualization, we use an undirected graph where edges have no direction and connections are bi-directional.',
  properties: [
    {
      label: 'Vertices',
      value: '20 nodes connected in a circular pattern with cross-connections'
    },
    {
      label: 'Edge Type',
      value: 'Undirected (bi-directional connections)'
    }
  ],
  nodes: Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    label: String.fromCharCode(65 + i)
  })),
  edges: [
    ...Array.from({ length: 19 }, (_, i) => ({
      source: String(i + 1),
      target: String(i + 2)
    })),
    { source: '20', target: '1' },
    { source: '1', target: '5' },
    { source: '2', target: '7' },
    { source: '3', target: '9' },
    { source: '4', target: '11' },
    { source: '6', target: '15' },
    { source: '8', target: '16' },
    { source: '10', target: '18' },
    { source: '12', target: '19' },
    { source: '13', target: '17' },
    { source: '14', target: '20' }
  ]
};

export const GRAPH_ALGORITHMS: Record<string, Algorithm> = {
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    description: 'BFS is a graph traversal algorithm that explores all vertices at the present depth before moving on to vertices at the next depth level. It uses a queue data structure to track which vertex to explore next.',
    timeComplexity: 'O(V + E) where V is the number of vertices and E is the number of edges',
    spaceComplexity: 'O(V) where V is the number of vertices',
    pseudocode: [
      'procedure BFS(G, startVertex):',
      '    let Q be a queue',
      '    Q.enqueue(startVertex)',
      '    mark startVertex as visited',
      '',
      '    while Q is not empty:',
      '        vertex = Q.dequeue()',
      '        for each neighbor of vertex:',
      '            if neighbor is not visited:',
      '                Q.enqueue(neighbor)',
      '                mark neighbor as visited'
    ]
  },
  dfs: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    description: 'DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to remember where to return when hitting a dead end.',
    timeComplexity: 'O(V + E) where V is the number of vertices and E is the number of edges',
    spaceComplexity: 'O(V) where V is the number of vertices',
    pseudocode: [
      'procedure DFS(G, startVertex):',
      '    mark startVertex as visited',
      '    for each neighbor of startVertex:',
      '        if neighbor is not visited:',
      '            DFS(G, neighbor)'
    ]
  }
};
