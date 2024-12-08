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
      // Generate 20 nodes with labels A through T
      const nodes = Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        label: String.fromCharCode(65 + i) // A=65 in ASCII
      }));

      // Create edges to form an interesting connected structure
      const edges = [
        // Circular connection
        ...Array.from({ length: 19 }, (_, i) => ({
          source: String(i + 1),
          target: String(i + 2)
        })),
        { source: '20', target: '1' }, // Complete the circle

        // Cross connections for more interesting visualization
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
      ];

      return <GraphVisualization 
        nodes={nodes} 
        edges={edges}
        width={800}  // Increased width
        height={600} // Increased height
      />;
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
