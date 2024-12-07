import { useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GeoJSON } from 'geojson';
import { WorldMapConfig } from '../../../../../../types/visualization';

const useWorldMap = () => {
  console.log('useWorldMap: Starting visualization creation');
  const createVisualization = useCallback(async (container: HTMLElement, config: WorldMapConfig) => {
    console.log('Container:', container);
    console.log('Config:', config);

    // Clear any existing content
    d3.select(container).selectAll('*').remove();

    const { width, height } = config.dimensions;
    const { margin } = config.dimensions;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    console.log('SVG container created');

    try {
      console.log('Starting map creation...');
      // Load world topology data
      const response = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json');
      const topology = await response.json();
      console.log('Topology loaded:', topology);

      const world = topojson.feature(topology, topology.objects.countries) as unknown as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
      console.log('GeoJSON world data:', world);

      // Create projection
      const projection = d3.geoMercator()
        .fitSize([width, height], world);
      console.log('Projection created with dimensions:', { width, height });

      // Create path generator
      const path = d3.geoPath()
        .projection(projection);
      console.log('Path generator created');

      // Draw map
      const paths = svg.selectAll('path')
        .data(world.features);
      
      console.log('Number of features to render:', world.features.length);
      
      paths.enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'country')
        .style('fill', config.styles.country.defaultFill)
        .style('stroke', config.styles.country.stroke)
        .style('stroke-width', config.styles.country.strokeWidth);

      console.log('Paths appended to SVG');

      paths
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style('fill', config.styles.country.hoverFill);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style('fill', config.styles.country.defaultFill);
        });

    } catch (error) {
      console.error('Error loading or rendering map data:', error);
      throw error;
    }
  }, []);

  return { createVisualization };
};

export default useWorldMap;
