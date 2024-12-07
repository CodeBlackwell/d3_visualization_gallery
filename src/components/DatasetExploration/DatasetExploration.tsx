import React from 'react';
import { useParams } from 'react-router-dom';
import VisualizationContainer from '../shared/VisualizationContainer/VisualizationContainer';
import './DatasetExploration.css';

interface DatasetConfig {
  title: string;
  description: string;
  visualizations: {
    type: string;
    title: string;
    description: string;
  }[];
}

const DATASET_CONFIGS: Record<string, DatasetConfig> = {
  globalhealth: {
    title: 'Global Health Statistics',
    description: 'Explore worldwide health indicators and trends across different countries and time periods.',
    visualizations: [
      {
        type: 'map',
        title: 'Geographic Distribution',
        description: 'View health statistics across different regions and countries'
      },
      {
        type: 'timeline',
        title: 'Temporal Trends',
        description: 'Analyze how health indicators have changed over time'
      },
      {
        type: 'comparison',
        title: 'Country Comparison',
        description: 'Compare health statistics between different countries'
      }
    ]
  }
};

const DatasetExploration: React.FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();
  const dataset = datasetId ? DATASET_CONFIGS[datasetId] : null;

  if (!dataset) {
    return (
      <div className="dataset-not-found">
        <h2>Dataset Not Found</h2>
        <p>The requested dataset could not be found.</p>
      </div>
    );
  }

  return (
    <div className="dataset-exploration">
      <div className="dataset-header">
        <h1>{dataset.title}</h1>
        <p className="dataset-description">{dataset.description}</p>
      </div>
      
      <div className="visualizations-grid">
        {dataset.visualizations.map((viz, index) => (
          <VisualizationContainer
            key={index}
            title={viz.title}
            description={viz.description}
          >
            <div className="visualization-placeholder">
              <p>Visualization coming soon!</p>
            </div>
          </VisualizationContainer>
        ))}
      </div>
    </div>
  );
};

export default DatasetExploration;
