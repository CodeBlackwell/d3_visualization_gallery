import React, { useState, useEffect } from 'react';
import './AlgorithmExploration.css';
import { useParams, useNavigate } from 'react-router-dom';
import AlgorithmExplanation from '../AlgorithmExplanation/AlgorithmExplanation';
import DataStructureExplanation from '../DataStructureExplanation/DataStructureExplanation';
import { useNodeHighlighting } from '../../../hooks/useNodeHighlighting';
import UndirectedGraphVisualization from '../../DataStructures/Graph/UndirectedGraph/UndirectedGraphVisualization';
import { UNDIRECTED_GRAPH, GRAPH_ALGORITHMS } from '../../DataStructures/Graph/UndirectedGraph/config';
import { Algorithm } from '../../DataStructures/types';
import { bfs, dfs } from '../../DataStructures/Graph/algorithms';
import { DATA_STRUCTURES, DataStructureType, GraphType } from '../../../constants/dataStructureConfig';

const AlgorithmExploration: React.FC = () => {
  const { category, type, algorithm } = useParams<{ category: DataStructureType; type: GraphType; algorithm: string }>();
  const navigate = useNavigate();
  
  console.log('URL Params:', { category, type, algorithm });
  console.log('Available Data Structures:', DATA_STRUCTURES);
  
  const [visualizationSpeed, setVisualizationSpeed] = useState(1000);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<keyof typeof GRAPH_ALGORITHMS>('bfs');

  useEffect(() => {
    console.log('Effect triggered with algorithm:', algorithm);
    if (algorithm && Object.keys(GRAPH_ALGORITHMS).includes(algorithm)) {
      setCurrentAlgorithm(algorithm as keyof typeof GRAPH_ALGORITHMS);
    }
  }, [algorithm]);

  const {
    currentHighlight,
    visitedNodes,
    isAnimating,
    highlightNodes,
    stopHighlighting
  } = useNodeHighlighting({ delay: visualizationSpeed });

  const handleAlgorithmChange = (algorithmId: keyof typeof GRAPH_ALGORITHMS) => {
    console.log('Algorithm change:', algorithmId);
    setCurrentAlgorithm(algorithmId);
    navigate(`/datastructures/${category}/${type}/${algorithmId}`);
    stopHighlighting();
  };

  const handleVisualization = () => {
    console.log('Visualization triggered:', { category, type, currentAlgorithm });
    if (category === 'graph') {
      if (type === 'undirected' || type === 'directed') {  
        if (currentAlgorithm === 'bfs') {
          console.log('Starting BFS traversal');
          const sequence = bfs('1', UNDIRECTED_GRAPH.nodes, UNDIRECTED_GRAPH.edges);
          console.log('BFS sequence:', sequence);
          highlightNodes(sequence);
        } else if (currentAlgorithm === 'dfs') {
          console.log('Starting DFS traversal');
          const sequence = dfs('1', UNDIRECTED_GRAPH.nodes, UNDIRECTED_GRAPH.edges);
          console.log('DFS sequence:', sequence);
          highlightNodes(sequence);
        }
      }
    }
  };

  if (!category) {
    console.log('Missing category');
    return <div>Missing category parameter</div>;
  }

  if (!type) {
    console.log('Missing type');
    return <div>Missing type parameter</div>;
  }

  if (!DATA_STRUCTURES[category]) {
    console.log('Invalid category:', category);
    return <div>Invalid category: {category}</div>;
  }

  if (!DATA_STRUCTURES[category].types[type]) {
    console.log('Invalid type:', type, 'for category:', category);
    return <div>Invalid type: {type} for {category}</div>;
  }

  const algorithmInfo = GRAPH_ALGORITHMS[currentAlgorithm];

  return (
    <div className="algorithm-exploration">
      <div className="algorithm-explanation-panel">
        <div className="explanation-scroll-container">
          <DataStructureExplanation 
            dataStructure={UNDIRECTED_GRAPH}
          />
          <AlgorithmExplanation
            algorithm={algorithmInfo}
            availableAlgorithms={Object.values(GRAPH_ALGORITHMS).map(({ id, name }) => ({
              id,
              name
            }))}
            onAlgorithmChange={handleAlgorithmChange}
            onSpeedChange={setVisualizationSpeed}
          />
        </div>
      </div>
      <div className="algorithm-exploration-container">
        <div className="visualization-panel">
          <div className="visualization-content">
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
                className="primary-button"
              >
                {isAnimating ? 'Visualizing...' : `Start ${currentAlgorithm.toUpperCase()}`}
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
      </div>
    </div>
  );
};

export default AlgorithmExploration;
