import React from 'react';
import DatasetExploration, { DatasetConfig } from '../../shared/DatasetExploration/DatasetExploration';

const GLOBAL_HEALTH_CONFIG: DatasetConfig = {
  title: 'Global Health Statistics',
  description: 'Explore worldwide health indicators and trends across different countries and time periods.',
  visualizations: [
    {
      type: 'map',
      title: 'Geographic Distribution',
      description: 'View health statistics across different regions and countries',
      // component: <WorldHealthMap /> // TODO: Implement actual visualization components
    },
    {
      type: 'timeline',
      title: 'Temporal Trends',
      description: 'Analyze how health indicators have changed over time',
      // component: <HealthTimeline />
    },
    {
      type: 'comparison',
      title: 'Country Comparison',
      description: 'Compare health statistics between different countries',
      // component: <CountryComparison />
    }
  ]
};

const GlobalHealthExploration: React.FC = () => {
  return <DatasetExploration config={GLOBAL_HEALTH_CONFIG} />;
};

export default GlobalHealthExploration;
