import React, { useState, useEffect } from 'react';
import DatasetExploration, { DatasetConfig } from '../../shared/DatasetExploration/DatasetExploration';
import WorldHealthMap from './Visualizations/WorldHealthMap/WorldHealthMap';
import * as d3 from 'd3';
import { countryToCode } from './utils/countryMapping';

interface HealthData {
  country: string;
  code: string;
  value: number;
}

interface RawHealthData {
  'Country': string;
  'Year': string;
  'Disease Name': string;
  'Disease Category': string;
  'Prevalence Rate (%)': string;
  'Incidence Rate (%)': string;
  'Mortality Rate (%)': string;
  'Age Group': string;
  'Gender': string;
  'Population Affected': string;
  'Healthcare Access (%)': string;
  'Doctors per 1000': string;
  'Hospital Beds per 1000': string;
  'Treatment Type': string;
  'Average Treatment Cost (USD)': string;
  'Availability of Vaccines/Treatment': string;
  'Recovery Rate (%)': string;
  'DALYs': string;
  'Improvement in 5 Years (%)': string;
  'Per Capita Income (USD)': string;
  'Education Index': string;
  'Urbanization Rate (%)': string;
}

type MetricKey = keyof Omit<RawHealthData, 'Country' | 'Year' | 'Disease Name' | 'Disease Category' | 'Age Group' | 'Gender' | 'Treatment Type' | 'Availability of Vaccines/Treatment'>;

const NUMERIC_METRICS: MetricKey[] = [
  'Prevalence Rate (%)',
  'Incidence Rate (%)',
  'Mortality Rate (%)',
  'Population Affected',
  'Healthcare Access (%)',
  'Doctors per 1000',
  'Hospital Beds per 1000',
  'Average Treatment Cost (USD)',
  'Recovery Rate (%)',
  'DALYs',
  'Improvement in 5 Years (%)',
  'Per Capita Income (USD)',
  'Education Index',
  'Urbanization Rate (%)'
];

const GlobalHealthExploration: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('Healthcare Access (%)');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/root_resources/Global_health_statistics/Global Health Statistics.csv');
        const csvText = await response.text();
        
        // Parse CSV data
        const parsedData = d3.csvParse(csvText) as RawHealthData[];
        
        // Get unique years
        const uniqueYears = Array.from(new Set(parsedData.map(d => d.Year))).sort();
        setYears(uniqueYears);
        
        // Filter data for selected year and metric
        const filteredData = parsedData
          .filter(d => d.Year === selectedYear)
          .map(d => ({
            country: d['Country'],
            code: countryToCode[d['Country']] || '',
            value: parseFloat(d[selectedMetric] || '0')
          }))
          .filter(d => !isNaN(d.value) && d.code); // Only include countries with valid codes

        setHealthData(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error loading health data:', err);
        setError('Failed to load health data. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMetric, selectedYear]);

  const GLOBAL_HEALTH_CONFIG: DatasetConfig = {
    title: 'Global Health Statistics',
    description: 'Explore worldwide health indicators and trends across different countries and time periods.',
    visualizations: [
      {
        type: 'map',
        title: 'Geographic Distribution',
        description: 'View health statistics across different regions and countries',
        component: (
          <div className="visualization-container">
            <div className="controls">
              <div className="control-group">
                <label>Metric:</label>
                <select 
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
                >
                  {NUMERIC_METRICS.map(metric => (
                    <option key={metric} value={metric}>{metric}</option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Year:</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="loading-indicator">Loading data...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <WorldHealthMap 
                data={healthData} 
                metric={selectedMetric}
              />
            )}
          </div>
        )
      }
    ]
  };

  return <DatasetExploration config={GLOBAL_HEALTH_CONFIG} />;
};

export default GlobalHealthExploration;
