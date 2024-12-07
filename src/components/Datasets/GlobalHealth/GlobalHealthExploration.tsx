import React from 'react';
import DatasetExploration, { DatasetConfig } from '../../shared/DatasetExploration/DatasetExploration';
import WorldHealthMap from './Visualizations/WorldHealthMap/WorldHealthMap';

// Sample health data - replace with actual data from your API
const SAMPLE_HEALTH_DATA = [
  { country: 'United States', code: 'USA', value: 78.5 },
  { country: 'Canada', code: 'CAN', value: 82.2 },
  { country: 'United Kingdom', code: 'GBR', value: 81.3 },
  { country: 'France', code: 'FRA', value: 82.7 },
  { country: 'Germany', code: 'DEU', value: 81.1 },
  { country: 'Japan', code: 'JPN', value: 84.2 },
  { country: 'Australia', code: 'AUS', value: 83.2 },
  // Add more countries as needed
];

const GLOBAL_HEALTH_CONFIG: DatasetConfig = {
  title: 'Global Health Statistics',
  description: 'Explore worldwide health indicators and trends across different countries and time periods.',
  visualizations: [
    {
      type: 'map',
      title: 'Geographic Distribution',
      description: 'View health statistics across different regions and countries',
      component: <WorldHealthMap data={SAMPLE_HEALTH_DATA} metric="Life Expectancy (years)" />
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
