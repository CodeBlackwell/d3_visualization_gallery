import React from 'react';
import './AlgorithmExploration.css';
import { useParams } from 'react-router-dom';
import GraphVisualization from '../GraphVisualization/GraphVisualization';

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

  const renderVisualization = () => {
    if (structure === 'graph') {
      // Example graph data - you may want to modify this based on your needs
      const nodes = [
        { id: '1', label: 'A' },
        { id: '2', label: 'B' },
        { id: '3', label: 'C' }
      ];
      const edges = [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '1' }
      ];
      return <GraphVisualization nodes={nodes} edges={edges} />;
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
