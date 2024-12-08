import React, { useEffect, useMemo, useState } from 'react';
import './AlgorithmExploration.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import GraphVisualization from '../GraphVisualization/GraphVisualization';
import AlgorithmExplanation from '../AlgorithmExplanation/AlgorithmExplanation';
import { useNodeHighlighting } from '../../../hooks/useNodeHighlighting';

const ALGORITHMS = {
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

const AVAILABLE_ALGORITHMS = Object.values(ALGORITHMS).map(({ id, name }) => ({
  id,
  name
}));

const AlgorithmExploration: React.FC = () => {
  const { structure } = useParams<{ structure: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [visualizationSpeed, setVisualizationSpeed] = useState(1000);
  const [type, setType] = useState<string>('bfs');

  // Debug component lifecycle
  useEffect(() => {
    console.log('AlgorithmExploration mounted');
    return () => console.log('AlgorithmExploration unmounted');
  }, []);

  const {
    currentHighlight,
    visitedNodes,
    isAnimating,
    highlightNodes,
    stopHighlighting
  } = useNodeHighlighting({
    delay: visualizationSpeed,
    onAnimationComplete: () => {
      console.log('Animation sequence completed');
    }
  });

  // Stop animation on navigation
  useEffect(() => {
    console.log('Location changed, stopping animation');
    stopHighlighting();
  }, [location, stopHighlighting]);

  // Helper functions for graph traversal
  const bfs = (startId: string, nodes: any[], edges: any[]): string[] => {
    const visited = new Set<string>();
    const sequence: string[] = [];
    const queue: string[] = [startId];
    
    // Create adjacency list
    const adjacencyList = new Map<string, string[]>();
    edges.forEach(edge => {
      if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
      if (!adjacencyList.has(edge.target)) adjacencyList.set(edge.target, []);
      adjacencyList.get(edge.source)!.push(edge.target);
      adjacencyList.get(edge.target)!.push(edge.source);
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!visited.has(currentId)) {
        visited.add(currentId);
        sequence.push(currentId);
        
        const neighbors = adjacencyList.get(currentId) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }

    return sequence;
  };

  const dfs = (startId: string, nodes: any[], edges: any[]): string[] => {
    console.log('Starting DFS with:', { startId, nodesCount: nodes.length, edgesCount: edges.length });
    const visited = new Set<string>();
    const sequence: string[] = [];
    
    // Create adjacency list
    const adjacencyList = new Map<string, string[]>();
    edges.forEach(edge => {
      if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
      if (!adjacencyList.has(edge.target)) adjacencyList.set(edge.target, []);
      adjacencyList.get(edge.source)!.push(edge.target);
      adjacencyList.get(edge.target)!.push(edge.source);
    });

    console.log('Adjacency list:', Object.fromEntries(adjacencyList));

    const dfsRecursive = (nodeId: string) => {
      console.log('Visiting node:', nodeId);
      visited.add(nodeId);
      sequence.push(nodeId);
      
      const neighbors = adjacencyList.get(nodeId) || [];
      console.log(`Node ${nodeId} neighbors:`, neighbors);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(startId);
    console.log('Final DFS sequence:', sequence);
    return sequence;
  };

  // Memoize nodes and edges
  const { nodes, edges } = useMemo(() => ({
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
  }), []);

  const handleAlgorithmChange = (algorithmId: string) => {
    navigate(`/datastructures/${structure}/${algorithmId}`);
    stopHighlighting();
  };

  const renderVisualization = () => {
    if (structure === 'graph') {
      console.log('Rendering graph visualization');

      const handleBFSHighlight = () => {
        console.log('Starting BFS traversal');
        const sequence = bfs('1', nodes, edges);
        console.log('BFS sequence:', sequence);
        highlightNodes(sequence);
      };

      const handleDFSHighlight = () => {
        console.log('Starting DFS traversal');
        const sequence = dfs('1', nodes, edges);
        console.log('DFS sequence:', sequence);
        highlightNodes(sequence);
      };

      // Use the correct handler based on algorithm type
      const handleVisualization = () => {
        console.log('Current algorithm type:', type);
        if (type === 'dfs') {
          handleDFSHighlight();
        } else {
          handleBFSHighlight();
        }
      };

      const currentAlgorithm = ALGORITHMS[type as keyof typeof ALGORITHMS] || ALGORITHMS.bfs;
      const algorithmInfo = {
        ...currentAlgorithm,
        visualizationState: {
          isPlaying: isAnimating,
          currentStep: visitedNodes.size,
          speed: visualizationSpeed
        },
        steps: isAnimating ? {
          current: visitedNodes.size,
          total: nodes.length,
          description: `Visited ${visitedNodes.size} of ${nodes.length} nodes`
        } : undefined
      };

      return (
        <div className="algorithm-exploration-container">
          <div className="algorithm-explanation-panel">
            <AlgorithmExplanation
              algorithm={algorithmInfo}
              availableAlgorithms={AVAILABLE_ALGORITHMS}
              onAlgorithmChange={handleAlgorithmChange}
              onSpeedChange={setVisualizationSpeed}
            />
          </div>
          <div className="visualization-panel">
            <GraphVisualization 
              nodes={nodes} 
              edges={edges}
              width={800}
              height={400}
              highlightedNode={currentHighlight}
              visitedNodes={visitedNodes}
            />
            <div className="controls">
              <button 
                onClick={handleVisualization}
                disabled={isAnimating}
              >
                {isAnimating ? 'Visualizing...' : `Start ${type.toUpperCase()}`}
              </button>
              {isAnimating && (
                <button 
                  onClick={stopHighlighting}
                  className="stop-button"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="algorithm-exploration">
      {renderVisualization()}
    </div>
  );
};

export default AlgorithmExploration;
