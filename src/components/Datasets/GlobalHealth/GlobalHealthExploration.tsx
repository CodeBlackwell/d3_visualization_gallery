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
      console.log('🔄 Starting data load process...');
      try {
        console.log('📊 Fetching CSV file...');
        const response = await fetch('/root_resources/Global_health_statistics/Global Health Statistics.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log(`📝 CSV file loaded, size: ${(csvText.length / 1024 / 1024).toFixed(2)}MB`);
        
        // Parse CSV data
        console.log('🔍 Parsing CSV data...');
        const parsedData = d3.csvParse(csvText) as RawHealthData[];
        console.log(`✅ Parsed ${parsedData.length} rows of data`);
        
        // Debug country names and mappings
        const uniqueCountries = [...new Set(parsedData.map((d: any) => d['Country']))];
        console.group('🌍 Country Mapping Analysis');
        console.log('Unique countries in data:', uniqueCountries);
        
        // Check mapping for each country
        const mappingResults = uniqueCountries.map(country => ({
          country,
          code: countryToCode[country],
          hasMapping: !!countryToCode[country]
        }));
        
        console.log('Mapping results:', mappingResults);
        console.log('Missing mappings:', mappingResults.filter(r => !r.hasMapping).map(r => r.country));
        console.groupEnd();
        
        // Debug: Data preparation
        console.group('🔍 Data Preparation Analysis');
        
        // Sample of raw data
        console.log('Raw data sample:', parsedData.slice(0, 2));
        
        // Filter for year
        const yearData = parsedData.filter(d => d.Year === selectedYear);
        console.log(`Records for year ${selectedYear}:`, yearData.length);
        
        // Check country mapping
        const sampleCountries = yearData.slice(0, 5).map(d => d['Country']);
        console.log('Sample countries:', sampleCountries);
        console.log('Their mappings:', sampleCountries.map(country => ({
          country,
          code: countryToCode[country],
          hasMapping: !!countryToCode[country]
        })));

        // Final data transformation
        const filteredData = yearData
          .map(d => {
            const code = countryToCode[d['Country']] || '';
            const value = parseFloat(d[selectedMetric] || '0');
            return {
              country: d['Country'],
              code,
              value
            };
          })
          .filter(d => !isNaN(d.value) && d.code);

        console.log('Final data sample:', filteredData.slice(0, 2));
        console.log('Final data structure:', {
          totalRecords: filteredData.length,
          sampleCodes: filteredData.slice(0, 5).map(d => d.code),
          sampleValues: filteredData.slice(0, 5).map(d => d.value)
        });
        console.groupEnd();
        
        // Get unique years
        const uniqueYears = Array.from(new Set(parsedData.map(d => d.Year))).sort();
        console.log(`📅 Found ${uniqueYears.length} unique years:`, uniqueYears);
        setYears(uniqueYears);
        
        // Log unique countries for debugging
        const uniqueCountries2 = Array.from(new Set(parsedData.map(d => d['Country'])));
        console.log('🌍 Unique countries in data:', uniqueCountries2);
        
        // Filter data for selected year and metric
        console.log(`🎯 Filtering data for year: ${selectedYear}, metric: ${selectedMetric}`);
        const yearDataFinal = parsedData.filter(d => d.Year === selectedYear);
        console.log(`📊 Found ${yearDataFinal.length} records for year ${selectedYear}`);

        // Debug country code mapping
        const countryMappingResults = yearDataFinal.map(d => {
          const country = d['Country'];
          const code = countryToCode[country];
          return { country, code, hasMapping: !!code };
        });

        console.log('🗺️ Country code mapping results:');
        console.log('Missing mappings:', countryMappingResults.filter(r => !r.hasMapping).map(r => r.country));
        console.log('Successful mappings:', countryMappingResults.filter(r => r.hasMapping).map(r => `${r.country} -> ${r.code}`));

        const filteredDataFinal = yearDataFinal
          .map(d => {
            const code = countryToCode[d['Country']] || '';
            const value = parseFloat(d[selectedMetric] || '0');
            return {
              country: d['Country'],
              code,
              value
            };
          })
          .filter(d => !isNaN(d.value) && d.code);

        console.log(`🗺️ Final dataset: ${filteredDataFinal.length} countries with valid data`);
        if (filteredDataFinal.length > 0) {
          console.log('Sample data point:', filteredDataFinal[0]);
        }
        console.log('📊 Value range:', {
          min: d3.min(filteredDataFinal, d => d.value),
          max: d3.max(filteredDataFinal, d => d.value),
          mean: d3.mean(filteredDataFinal, d => d.value)?.toFixed(2)
        });

        if (filteredDataFinal.length === 0) {
          console.warn('⚠️ No valid data points after filtering!');
          setError('No valid data available for the selected year and metric.');
        } else {
          setHealthData(filteredDataFinal);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Error loading health data:', err);
        setError('Failed to load health data. Please check the console for details.');
      } finally {
        setLoading(false);
        console.log('🏁 Data loading process completed');
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
