import React, { useState } from 'react';
import DataSetExplorationVisualizationContainer from '../DataSetExplorationVisualizationContainer/DataSetExplorationVisualizationContainer';
import './DatasetExploration.css';

export interface Visualization {
  type: string;
  title: string;
  description: string;
  component?: React.ReactNode;
}

export interface DatasetConfig {
  title: string;
  description: string;
  visualizations: Visualization[];
}

interface DatasetExplorationProps {
  config: DatasetConfig;
}

const DatasetExploration: React.FC<DatasetExplorationProps> = ({ config }) => {
  const [selectedViz, setSelectedViz] = useState<number>(0);

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
                onClick={() => setSelectedViz(index)}
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
