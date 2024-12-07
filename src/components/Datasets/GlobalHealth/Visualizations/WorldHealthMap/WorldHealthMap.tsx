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
    width: 960,
    height: 500
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

        // Create color scale
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
          .domain([0, d3.max(data, d => d.value) || 100]);

        // Create projection
        const projection = d3.geoMercator()
          .fitSize([width, height], world);

        // Create path generator
        const path = d3.geoPath()
          .projection(projection);

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
          .on('mouseover', function(event, d: any) {
            const countryData = data.find(item => item.code === d.id);
            
            // Highlight country
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke-width', 2);

            // Show tooltip
            const tooltip = d3.select(container)
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
              .style('left', (event.pageX) + 'px')
              .style('top', (event.pageY - 28) + 'px');
          })
          .on('mouseout', function(event, d) {
            // Remove highlight
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke-width', config.styles.country.strokeWidth);

            // Remove tooltip
            d3.select(container)
              .selectAll('.tooltip')
              .remove();
          });

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
