import React, { useState } from 'react';
import './AlgorithmExploration.css';
import { useParams, useNavigate } from 'react-router-dom';
import AlgorithmExplanation from '../AlgorithmExplanation/AlgorithmExplanation';
import DataStructureExplanation from '../DataStructureExplanation/DataStructureExplanation';
import { useNodeHighlighting } from '../../../hooks/useNodeHighlighting';
import UndirectedGraphVisualization from '../../DataStructures/Graph/UndirectedGraph/UndirectedGraphVisualization';
import { UNDIRECTED_GRAPH, GRAPH_ALGORITHMS } from '../../DataStructures/Graph/UndirectedGraph/config';
import { Algorithm } from '../../DataStructures/types';
import { bfs, dfs } from '../../DataStructures/Graph/algorithms';

const AVAILABLE_ALGORITHMS = Object.values(GRAPH_ALGORITHMS).map(({ id, name }) => ({
  id,
  name
}));

const AlgorithmExploration: React.FC = () => {
  const { structure } = useParams<{ structure: string }>();
  const navigate = useNavigate();
  const [visualizationSpeed, setVisualizationSpeed] = useState(1000);
  const [type, setType] = useState<keyof typeof GRAPH_ALGORITHMS>('bfs');

  const {
    currentHighlight,
    visitedNodes,
    isAnimating,
    highlightNodes,
    stopHighlighting
  } = useNodeHighlighting({ delay: visualizationSpeed });

  const handleAlgorithmChange = (algorithmId: keyof typeof GRAPH_ALGORITHMS) => {
    setType(algorithmId);
    navigate(`/datastructures/${structure}/${algorithmId}`);
    stopHighlighting();
  };

  const renderVisualization = () => {
    if (structure === 'graph') {
      const handleBFSHighlight = () => {
        console.log('Starting BFS traversal');
        const sequence = bfs('1', UNDIRECTED_GRAPH.nodes, UNDIRECTED_GRAPH.edges);
        console.log('BFS sequence:', sequence);
        highlightNodes(sequence);
      };

      const handleDFSHighlight = () => {
        console.log('Starting DFS traversal');
        const sequence = dfs('1', UNDIRECTED_GRAPH.nodes, UNDIRECTED_GRAPH.edges);
        console.log('DFS sequence:', sequence);
        highlightNodes(sequence);
      };

      const handleVisualization = () => {
        console.log('Current algorithm type:', type);
        if (type === 'dfs') {
          handleDFSHighlight();
        } else {
          handleBFSHighlight();
        }
      };

      const currentAlgorithm = GRAPH_ALGORITHMS[type] ?? GRAPH_ALGORITHMS.bfs;
      const algorithmInfo: Algorithm = {
        ...currentAlgorithm,
        visualizationState: {
          isPlaying: isAnimating,
          currentStep: visitedNodes.size,
          speed: visualizationSpeed
        },
        steps: isAnimating ? {
          current: visitedNodes.size,
          total: UNDIRECTED_GRAPH.nodes.length,
          description: `Visited ${visitedNodes.size} of ${UNDIRECTED_GRAPH.nodes.length} nodes`
        } : undefined
      };

      return (
        <div className="algorithm-exploration-container">
          <div className="algorithm-explanation-panel">
            <DataStructureExplanation 
              dataStructure={UNDIRECTED_GRAPH}
            />
            <AlgorithmExplanation
              algorithm={algorithmInfo}
              availableAlgorithms={AVAILABLE_ALGORITHMS}
              onAlgorithmChange={handleAlgorithmChange}
              onSpeedChange={setVisualizationSpeed}
            />
          </div>
          <div className="visualization-panel">
            <UndirectedGraphVisualization
              nodes={UNDIRECTED_GRAPH.nodes}
              edges={UNDIRECTED_GRAPH.edges}
              width={800}
              height={400}
              highlightedNode={currentHighlight ?? undefined}
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
