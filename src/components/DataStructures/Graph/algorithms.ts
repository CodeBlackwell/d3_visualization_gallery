import { GraphNode, GraphEdge } from './types';

export function bfs(startId: string, nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const visited = new Set<string>();
  const queue: string[] = [startId];
  const result: string[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (!visited.has(currentId)) {
      visited.add(currentId);
      result.push(currentId);

      // Find all adjacent nodes
      const adjacentEdges = edges.filter(edge => 
        edge.source === currentId || edge.target === currentId
      );
      
      for (const edge of adjacentEdges) {
        const nextId = edge.source === currentId ? edge.target : edge.source;
        if (!visited.has(nextId)) {
          queue.push(nextId);
        }
      }
    }
  }

  return result;
}

export function dfs(startId: string, nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfsHelper(currentId: string) {
    if (!visited.has(currentId)) {
      visited.add(currentId);
      result.push(currentId);

      // Find all adjacent nodes
      const adjacentEdges = edges.filter(edge => 
        edge.source === currentId || edge.target === currentId
      );
      
      for (const edge of adjacentEdges) {
        const nextId = edge.source === currentId ? edge.target : edge.source;
        if (!visited.has(nextId)) {
          dfsHelper(nextId);
        }
      }
    }
  }

  dfsHelper(startId);
  return result;
}
