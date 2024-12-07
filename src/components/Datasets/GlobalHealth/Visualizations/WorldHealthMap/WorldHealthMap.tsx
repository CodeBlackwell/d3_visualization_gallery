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

interface WorldHealthMapProps {
  className?: string;
  data?: HealthData[];
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

const WorldHealthMap: React.FC<WorldHealthMapProps> = ({ className, data = [], metric = 'Life Expectancy' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const createVisualization = async () => {
      console.log('🎨 Starting map visualization creation...');
      console.log('📊 Received data points:', data.length);
      
      const container = containerRef.current!;
      const config = WORLD_HEALTH_MAP_CONFIG;
      
      // Clear any existing content
      d3.select(container).selectAll('*').remove();
      console.log('🧹 Cleared previous visualization');

      const { width, height } = config.dimensions;
      const { margin } = config.dimensions;

      // Create SVG
      console.log('📐 Creating SVG with dimensions:', { width, height, margin });
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
        console.log('🌍 Loading world topology data...');
        const response = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json');
        if (!response.ok) {
          throw new Error(`Failed to load topology: ${response.status}`);
        }
        const topology = await response.json();
        const world = topojson.feature(topology, topology.objects.countries) as unknown as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
        console.log(`🗺️ Loaded topology with ${world.features.length} countries`);

        // Create color scale
        const valueExtent = d3.extent(data, d => d.value);
        console.log('📊 Value extent for color scale:', valueExtent);
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
          .domain([
            d3.min(data, d => d.value) || 0,
            d3.max(data, d => d.value) || 100
          ]);

        // Create projection
        console.log('🎯 Creating map projection...');
        const projection = d3.geoMercator()
          .fitSize([width, height], world);

        // Create path generator
        const path = d3.geoPath()
          .projection(projection);

        // Create tooltip
        console.log('💬 Creating tooltip...');
        const tooltip = d3.select(container)
          .append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)
          .style('position', 'fixed')
          .style('background-color', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('max-width', '200px')
          .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)');

        // Draw map
        console.log('🎨 Drawing countries...');
        let matchedCountries = 0;
        svg.selectAll('path')
          .data(world.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', 'country')
          .style('fill', (d: any) => {
            const countryData = data.find(item => item.code === d.id);
            if (countryData) matchedCountries++;
            return countryData ? colorScale(countryData.value) : config.styles.country.defaultFill;
          })
          .style('stroke', config.styles.country.stroke)
          .style('stroke-width', config.styles.country.strokeWidth);

        console.log(`🎯 Matched ${matchedCountries} countries with data out of ${world.features.length} total countries`);

        // Add mouse events
        console.log('🖱️ Adding mouse interactions...');
        svg.selectAll('path')
          .on('mousemove', function(event, d: any) {
            const countryData = data.find(item => item.code === d.id);
            
            if (countryData) {
              tooltip.transition()
                .duration(50)
                .style('opacity', 0.9);
              
              tooltip.html(`
                <strong>${countryData.country}</strong><br/>
                ${metric}: ${countryData.value.toFixed(1)}
              `)
                .style('left', `${event.clientX + 12}px`)
                .style('top', `${event.clientY - 28}px`);
            }
          })
          .on('mouseout', () => {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0);
          });

        // Add legend
        console.log('📚 Adding legend...');
        const legendWidth = 200;
        const legendHeight = 10;
        
        const legendScale = d3.scaleLinear()
          .domain(colorScale.domain())
          .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
          .ticks(5)
          .tickFormat(d => d.toFixed(1));

        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${width - legendWidth - 20},${height - 40})`);

        legend.append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#linear-gradient)');

        console.log('✅ Map visualization completed');

      } catch (error) {
        console.error('❌ Error creating visualization:', error);
        d3.select(container)
          .append('div')
          .attr('class', 'error-message')
          .text('Error loading map data. Please try again later.');
      }
    };

    createVisualization();
  }, [data, metric]);

  return (
    <div 
      ref={containerRef}
      className={`world-health-map ${className || ''}`}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  );
};

export default WorldHealthMap;
