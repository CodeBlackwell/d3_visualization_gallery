import React, { useState, useEffect } from 'react';
import DataSetExplorationVisualizationContainer from '../DataSetExplorationVisualizationContainer/DataSetExplorationVisualizationContainer';
import './DatasetExploration.css';

export interface Visualization {
  type: string;
  title: string;
  description: string;
  component?: React.ReactNode;
  onClick?: () => void;
}

export interface DatasetConfig {
  title: string;
  description: string;
  visualizations: Visualization[];
}

interface DatasetExplorationProps {
  config: DatasetConfig;
  initialVisualization?: number;
}

const DatasetExploration: React.FC<DatasetExplorationProps> = ({ config, initialVisualization = 0 }) => {
  const [selectedViz, setSelectedViz] = useState<number>(initialVisualization);

  useEffect(() => {
    setSelectedViz(initialVisualization);
  }, [initialVisualization]);

  const handleVisualizationClick = (index: number) => {
    setSelectedViz(index);
    config.visualizations[index].onClick?.();
  };

  return (
    <div className="dataset-exploration">
      <div className="dataset-header">
        <h1>{config.title}</h1>
        <p className="dataset-description">{config.description}</p>
      </div>
      
      <div className="dataset-content">
        <div className="visualization-sidebar">
          <h2>Visualizations</h2>
          <ul className="visualization-list">
            {config.visualizations.map((viz, index) => (
              <li 
                key={index}
                className={`visualization-item ${selectedViz === index ? 'active' : ''}`}
                onClick={() => handleVisualizationClick(index)}
              >
                <h3>{viz.title}</h3>
                <p>{viz.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="visualization-main">
          <DataSetExplorationVisualizationContainer
            title={config.visualizations[selectedViz].title}
            description={config.visualizations[selectedViz].description}
          >
            {config.visualizations[selectedViz].component || (
              <div className="visualization-placeholder">
                <p>Visualization coming soon!</p>
              </div>
            )}
          </DataSetExplorationVisualizationContainer>
        </div>
      </div>
    </div>
  );
};

export default DatasetExploration;
