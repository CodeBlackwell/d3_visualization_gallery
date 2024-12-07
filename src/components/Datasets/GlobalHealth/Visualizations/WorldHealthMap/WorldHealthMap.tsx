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

        // Create color scale with a better color scheme
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
          .domain([
            d3.min(data, d => d.value) || 0,
            d3.max(data, d => d.value) || 100
          ]);

        // Create projection
        const projection = d3.geoMercator()
          .fitSize([width, height], world);

        // Create path generator
        const path = d3.geoPath()
          .projection(projection);

        // Create tooltip
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
        svg.selectAll('path')
          .data(world.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', 'country')
          .style('fill', (d: any) => {
            const countryData = data.find(item => item.code === d.id);
            return countryData ? colorScale(countryData.value) : config.styles.country.defaultFill;
          })
          .style('stroke', config.styles.country.stroke)
          .style('stroke-width', config.styles.country.strokeWidth)
          .on('mousemove', function(event, d: any) {
            const countryData = data.find(item => item.code === d.id);
            
            // Highlight country
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke-width', 2)
              .style('stroke', '#000');

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
          .on('mouseout', function() {
            // Reset highlight
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke-width', config.styles.country.strokeWidth)
              .style('stroke', config.styles.country.stroke);

            // Hide tooltip
            tooltip.transition()
              .duration(200)
              .style('opacity', 0);
          });

        // Add legend
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

        const defs = svg.append('defs');
        const linearGradient = defs.append('linearGradient')
          .attr('id', 'linear-gradient');

        linearGradient.selectAll('stop')
          .data(d3.range(0, 1.1, 0.1))
          .enter()
          .append('stop')
          .attr('offset', d => d * 100 + '%')
          .attr('stop-color', d => colorScale(d * (colorScale.domain()[1] - colorScale.domain()[0]) + colorScale.domain()[0]));

        legend.append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#linear-gradient)');

        legend.append('g')
          .attr('transform', `translate(0,${legendHeight})`)
          .call(legendAxis)
          .selectAll('text')
          .style('font-size', '10px');

        legend.append('text')
          .attr('x', legendWidth / 2)
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(metric);

      } catch (error) {
        console.error('Error creating visualization:', error);
        // Add error message to the container
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
