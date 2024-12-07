import React, { useState, useEffect } from 'react';
import DatasetExploration, { DatasetConfig } from '../../shared/DatasetExploration/DatasetExploration';
import WorldHealthMap from './Visualizations/WorldHealthMap/WorldHealthMap';
import * as d3 from 'd3';

interface HealthData {
  country: string;
  code: string;
  value: number;
}

const GlobalHealthExploration: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await d3.csv('./Visualizations/WorldHealthMap/Global Health Statistics.csv');
        const formattedData = data.map(d => ({
          country: d.country || '',
          code: d.code || '',
          value: parseFloat(d.value || '0')
        }));
        setHealthData(formattedData);
      } catch (error) {
        console.error('Error loading health data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const GLOBAL_HEALTH_CONFIG: DatasetConfig = {
    title: 'Global Health Statistics',
    description: 'Explore worldwide health indicators and trends across different countries and time periods.',
    visualizations: [
      {
        type: 'map',
        title: 'Geographic Distribution',
        description: 'View health statistics across different regions and countries',
        component: loading ? <div>Loading data...</div> : <WorldHealthMap data={healthData} metric="Life Expectancy (years)" />
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

  return <DatasetExploration config={GLOBAL_HEALTH_CONFIG} />;
};

export default GlobalHealthExploration;
