import React from 'react';
import './DataSetExplorationVisualizationContainer.css';

interface DataSetExplorationVisualizationContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const DataSetExplorationVisualizationContainer: React.FC<DataSetExplorationVisualizationContainerProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="dataset-visualization-container">
      <div className="dataset-visualization-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="dataset-visualization-content">
        {children || (
          <div className="visualization-placeholder">
            <p>Visualization coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSetExplorationVisualizationContainer;
