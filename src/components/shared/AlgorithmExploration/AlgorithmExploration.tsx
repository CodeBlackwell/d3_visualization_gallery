import React, { useEffect, useMemo } from 'react';
import './AlgorithmExploration.css';
import { useParams, useLocation } from 'react-router-dom';
import GraphVisualization from '../GraphVisualization/GraphVisualization';
import { useNodeHighlighting } from '../../../hooks/useNodeHighlighting';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  complexity: string;
  pseudocode: string[];
  visualizationComponent?: React.ComponentType<any>;
}

const AlgorithmExploration: React.FC = () => {
  const { structure, type } = useParams<{ structure: string; type: string }>();
  const location = useLocation();

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
    delay: 500,
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
    const visited = new Set<string>();
    const sequence: string[] = [];
    
    const adjacencyList = new Map<string, string[]>();
    edges.forEach(edge => {
      if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
      if (!adjacencyList.has(edge.target)) adjacencyList.set(edge.target, []);
      adjacencyList.get(edge.source)!.push(edge.target);
      adjacencyList.get(edge.target)!.push(edge.source);
    });

    const dfsRecursive = (nodeId: string) => {
      visited.add(nodeId);
      sequence.push(nodeId);
      
      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(startId);
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

  const renderVisualization = () => {
    if (structure === 'graph') {
      console.log('Rendering graph visualization');

      const handleBFSHighlight = () => {
        console.log('Starting BFS traversal');
        const sequence = bfs('1', nodes, edges);
        highlightNodes(sequence);
      };

      const handleDFSHighlight = () => {
        console.log('Starting DFS traversal');
        const sequence = dfs('1', nodes, edges);
        highlightNodes(sequence);
      };

      return (
        <div className="graph-container">
          <GraphVisualization 
            nodes={nodes} 
            edges={edges}
            width={800}
            height={600}
            highlightedNode={currentHighlight}
            visitedNodes={visitedNodes}
          />
          <div className="controls">
            <button 
              onClick={handleBFSHighlight}
              disabled={isAnimating}
            >
              {isAnimating ? 'Highlighting...' : 'BFS Highlight'}
            </button>
            <button 
              onClick={handleDFSHighlight}
              disabled={isAnimating}
            >
              {isAnimating ? 'Highlighting...' : 'DFS Highlight'}
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
      );
    }
    return (
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>Visualization for {structure} - {type} is under development.</p>
      </div>
    );
  };

  return (
    <div className="algorithm-exploration">
      <div className="algorithm-exploration__header">
        <h1>{type} {structure}</h1>
        <p>Explore and understand the structure and behavior</p>
      </div>
      <div className="algorithm-exploration__content">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default AlgorithmExploration;
