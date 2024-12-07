import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GeoJSON } from 'geojson';
import { WorldMapConfig } from '../../../../../types/visualization';
import './WorldHealthMap.css';

interface HealthData {
  country: string;
  code: string;
  value: number;
}

interface CSVHealthData {
  Country: string;
  Year: string;
  'Disease Name': string;
  'Prevalence Rate (%)': string;
  'Mortality Rate (%)': string;
  'Healthcare Access (%)': string;
}

interface WorldHealthMapProps {
  className?: string;
  data?: HealthData[] | CSVHealthData[];
  metric?: string;
}

const WORLD_HEALTH_MAP_CONFIG: WorldMapConfig = {
  dimensions: {
    margin: { top: 20, right: 20, bottom: 60, left: 20 }, // Increased bottom margin for legend
    width: 1300, // 960 * 1.2
    height: 800  // 500 * 1.2
  },
  styles: {
    country: {
      defaultFill: '#e0e0e0',
      hoverFill: '#a0a0a0',
      stroke: '#ffffff',
      strokeWidth: 0.5
    }
  }
};

function processHealthData(csvData: CSVHealthData[] | HealthData[], metric: string): HealthData[] {
  // If data is already HealthData[], just return it
  if (csvData.length > 0 && 'code' in csvData[0]) {
    console.log('Data is already in HealthData format');
    return csvData as HealthData[];
  }

  console.log(`Processing ${csvData.length} rows of CSV health data`);
  const unmappedCountries = new Set<string>();
  
  // Create reverse mapping for country names to ISO codes
  const countryNameToCode: { [key: string]: string } = {
    'Italy': 'ITA',
    'France': 'FRA',
    'Turkey': 'TUR',
    'Indonesia': 'IDN',
    'Saudi Arabia': 'SAU',
    'United States': 'USA',
    'Nigeria': 'NGA',
    'Australia': 'AUS',
    'Canada': 'CAN',
    'Mexico': 'MEX',
    'China': 'CHN',
    'South Africa': 'ZAF',
    'Japan': 'JPN',
    'United Kingdom': 'GBR',
    'Russia': 'RUS',
    'Brazil': 'BRA',
    'Germany': 'DEU',
    'India': 'IND',
    'Argentina': 'ARG',
    'South Korea': 'KOR',
    // Add more mappings as needed
  };

  // Convert CSVHealthData to HealthData
  const result = (csvData as CSVHealthData[])
    .map(row => {
      let value: number;
      switch (metric) {
        case 'Prevalence Rate':
          value = parseFloat(row['Prevalence Rate (%)']);
          break;
        case 'Mortality Rate':
          value = parseFloat(row['Mortality Rate (%)']);
          break;
        case 'Healthcare Access':
          value = parseFloat(row['Healthcare Access (%)']);
          break;
        default:
          value = 0; // Default fallback
      }
      
      const isoCode = countryNameToCode[row.Country];
      if (!isoCode) {
        unmappedCountries.add(row.Country);
      }
      
      return {
        country: row.Country,
        code: isoCode || row.Country,
        value: isNaN(value) ? 0 : value
      };
    })
    .filter(data => !isNaN(data.value));

  // Log summary of unmapped countries
  if (unmappedCountries.size > 0) {
    console.log('Countries without ISO code mapping:', Array.from(unmappedCountries).sort());
    console.log(`Total unmapped countries: ${unmappedCountries.size}`);
  }
  console.log(`Successfully processed ${result.length} countries with data`);

  return result;
}

const WorldHealthMap: React.FC<WorldHealthMapProps> = ({ className, data = [], metric = 'Life Expectancy' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    const processedData = processHealthData(data, metric);

    const createVisualization = async () => {
      const container = containerRef.current!;
      const config = WORLD_HEALTH_MAP_CONFIG;
      
      // Clear any existing content
      d3.select(container).selectAll('*').remove();

      const { width, height } = config.dimensions;
      const { margin } = config.dimensions;

      // Create SVG
      const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      try {
        // Load world topology data
        const response = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json');
        const topology = await response.json();
        const world = topojson.feature(topology, topology.objects.countries) as unknown as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;

        // Debug map features
        console.group('🗺️ Map Feature Analysis');
        console.log('Sample feature IDs:', world.features.slice(0, 5).map(f => ({
            id: f.id,
            properties: f.properties
        })));
        
        // Log incoming data format
        console.log('Sample data format:', processedData.slice(0, 5));
        
        // Track matches and mismatches
        let matches = 0;
        let mismatches = new Set();

        // Create color scale
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
          .domain([0, d3.max(processedData.map(d => d.value)) || 100]);

        // Create projection
        const projection = d3.geoMercator()
          .fitSize([width, height], world);

        // Create path generator
        const path = d3.geoPath()
          .projection(projection);

        const numericToISO: { [key: string]: string } = {
          // Common ISO 3166-1 numeric to alpha-3 mappings
          '004': 'AFG', // Afghanistan
          '008': 'ALB', // Albania
          '012': 'DZA', // Algeria
          '024': 'AGO', // Angola
          '032': 'ARG', // Argentina
          '036': 'AUS', // Australia
          '040': 'AUT', // Austria
          '044': 'BHS', // Bahamas
          '048': 'BHR', // Bahrain
          '050': 'BGD', // Bangladesh
          '056': 'BEL', // Belgium
          '068': 'BOL', // Bolivia
          '072': 'BWA', // Botswana
          '076': 'BRA', // Brazil
          '084': 'BLZ', // Belize
          '120': 'CMR', // Cameroon
          '124': 'CAN', // Canada
          '148': 'TCD', // Chad
          '152': 'CHL', // Chile
          '156': 'CHN', // China
          '170': 'COL', // Colombia
          '180': 'COD', // Democratic Republic of the Congo
          '188': 'CRI', // Costa Rica
          '192': 'CUB', // Cuba
          '204': 'BEN', // Benin
          '214': 'DOM', // Dominican Republic
          '218': 'ECU', // Ecuador
          '222': 'SLV', // El Salvador
          '238': 'FLK', // Falkland Islands
          '242': 'FJI', // Fiji
          '250': 'FRA', // France
          '260': 'ATF', // French Southern Territories
          '276': 'DEU', // Germany
          '288': 'GHA', // Ghana
          '304': 'GRL', // Greenland
          '320': 'GTM', // Guatemala
          '324': 'GIN', // Guinea
          '328': 'GUY', // Guyana
          '332': 'HTI', // Haiti
          '340': 'HND', // Honduras
          '356': 'IND', // India
          '360': 'IDN', // Indonesia
          '384': 'CIV', // Côte d'Ivoire
          '388': 'JAM', // Jamaica
          '398': 'KAZ', // Kazakhstan
          '404': 'KEN', // Kenya
          '426': 'LSO', // Lesotho
          '430': 'LBR', // Liberia
          '466': 'MLI', // Mali
          '478': 'MRT', // Mauritania
          '484': 'MEX', // Mexico
          '504': 'MAR', // Morocco
          '516': 'NAM', // Namibia
          '558': 'NIC', // Nicaragua
          '562': 'NER', // Niger
          '566': 'NGA', // Nigeria
          '578': 'NOR', // Norway
          '591': 'PAN', // Panama
          '598': 'PNG', // Papua New Guinea
          '604': 'PER', // Peru
          '624': 'GNB', // Guinea-Bissau
          '626': 'TLS', // Timor-Leste
          '630': 'PRI', // Puerto Rico
          '643': 'RUS', // Russia
          '682': 'SAU', // Saudi Arabia
          '686': 'SEN', // Senegal
          '694': 'SLE', // Sierra Leone
          '706': 'SOM', // Somalia
          '710': 'ZAF', // South Africa
          '716': 'ZWE', // Zimbabwe
          '729': 'SDN', // Sudan
          '732': 'ESH', // Western Sahara
          '740': 'SUR', // Suriname
          '768': 'TGO', // Togo
          '792': 'TUR', // Turkey
          '800': 'UGA', // Uganda
          '804': 'UKR', // Ukraine
          '818': 'EGY', // Egypt
          '826': 'GBR', // United Kingdom
          '834': 'TZA', // Tanzania
          '840': 'USA', // United States
          '858': 'URY', // Uruguay
          '860': 'UZB', // Uzbekistan
          '862': 'VEN', // Venezuela
          '887': 'YEM', // Yemen
          '894': 'ZMB'  // Zambia
        } as const;

        svg.selectAll('path')
          .data(world.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', 'country')
          .style('fill', (d: any) => {
            const isoCode = numericToISO[d.id];
            const countryData = processedData.find(item => item.code === isoCode);
            if (countryData) {
                matches++;
            } else {
                mismatches.add(d.id);
            }
            return countryData ? colorScale(countryData.value) : config.styles.country.defaultFill;
          })
          .style('stroke', config.styles.country.stroke)
          .style('stroke-width', config.styles.country.strokeWidth)
          .on('mouseover', function(event, d: any) {
            const isoCode = numericToISO[d.id];
            const countryData = processedData.find(item => item.code === isoCode);
            
            // Highlight country
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke-width', 2);

            // Show tooltip
            const tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

            tooltip.transition()
              .duration(200)
              .style('opacity', .9);

            tooltip.html(`
              <strong>${d.properties.name}</strong><br/>
              ${metric}: ${countryData ? countryData.value.toFixed(1) : 'No data'}
            `)
              .style('left', (event.pageX + 12) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          })
          .on('mouseout', function(event, d) {
            // Remove highlight
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke-width', config.styles.country.strokeWidth);

            // Remove tooltip
            d3.select('body')
              .selectAll('.tooltip')
              .remove();
          });

        console.log(`Matched ${matches} countries`);
        console.log('Unmatched feature IDs:', Array.from(mismatches));
        console.groupEnd();

        // Add legend
        const legendWidth = 200;
        const legendHeight = 10;

        const legendScale = d3.scaleLinear()
          .domain(colorScale.domain())
          .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
          .ticks(5)
          .tickFormat(d => d.toString());

        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${(width - legendWidth) / 2},${height + 20})`);

        const defs = svg.append('defs');
        const linearGradient = defs.append('linearGradient')
          .attr('id', 'legend-gradient')
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '100%')
          .attr('y2', '0%');

        linearGradient.selectAll('stop')
          .data(d3.range(0, 1.1, 0.1))
          .enter()
          .append('stop')
          .attr('offset', d => `${d * 100}%`)
          .attr('stop-color', d => colorScale(d * (colorScale.domain()[1] - colorScale.domain()[0]) + colorScale.domain()[0]));

        legend.append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#legend-gradient)');

        legend.append('g')
          .attr('transform', `translate(0,${legendHeight})`)
          .call(legendAxis);

        legend.append('text')
          .attr('x', legendWidth / 2)
          .attr('y', legendHeight + 30)
          .attr('text-anchor', 'middle')
          .text(metric);

      } catch (error) {
        console.error('Error loading or rendering map data:', error);
        throw error;
      }
    };

    createVisualization();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [data, metric]);

  return (
    <div 
      ref={containerRef} 
      className={`world-health-map-container ${className || ''}`}
    />
  );
};

export default WorldHealthMap;
