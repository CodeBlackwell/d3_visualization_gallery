import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './RadialChart.css';

interface DataPoint {
  Country: string;
  Value: number;
}

interface RadialChartProps {
  data?: DataPoint[];
  dataUrl?: string;
  width?: number;
  height?: number;
}

const RadialChart: React.FC<RadialChartProps> = ({
  data,
  dataUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv',
  width = 460,
  height = 460,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear any existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 100, right: 0, bottom: 0, left: 0 };
    const innerRadius = 90;
    const outerRadius = Math.min(width, height) / 2;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    const createVisualization = (data: DataPoint[]) => {
      const x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(data.map(d => d.Country));

      const y = d3.scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, 13000]);

      const ybis = d3.scaleRadial()
        .range([innerRadius, 5])
        .domain([0, 13000]);

      // Color scale
      const colorScale = d3.scaleSequential()
        .domain([0, data.length])
        .interpolator(d3.interpolateHcl('#4CC9F0', '#4361EE'));

      // Create main arcs
      svg.append('g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('fill', (_, i) => colorScale(i))
        .attr('class', 'radial-arc')
        .attr('d', d3.arc<DataPoint>()
          .innerRadius(innerRadius)
          .outerRadius(d => y(d.Value))
          .startAngle(d => x(d.Country)!)
          .endAngle(d => x(d.Country)! + x.bandwidth()!)
          .padAngle(0.01)
          .padRadius(innerRadius))
        .style('filter', 'drop-shadow(0 0 4px rgba(0,0,0,0.2))')
        .on('mouseover', (event, d) => {
          // Create tooltip
          d3.select('body')
            .selectAll('.tooltip')
            .data([null])
            .join('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .html(`
              <strong>${d.Country}</strong><br/>
              <strong>Value:</strong> ${d.Value.toLocaleString()}
            `)
            .style('left', (event.pageX + 12) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mousemove', (event) => {
          d3.select('.tooltip')
            .style('left', (event.pageX + 12) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', () => {
          d3.select('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
        });

      // Add country labels
      svg.append('g')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('text-anchor', d => (x(d.Country)! + x.bandwidth()! / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? 'end' : 'start')
        .attr('transform', d => `rotate(${(x(d.Country)! + x.bandwidth()! / 2) * 180 / Math.PI - 90})translate(${y(d.Value) + 10},0)`)
        .append('text')
        .text(d => d.Country)
        .attr('transform', d => (x(d.Country)! + x.bandwidth()! / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? 'rotate(180)' : 'rotate(0)')
        .style('font-size', '11px')
        .style('fill', '#e0e0e0')
        .attr('alignment-baseline', 'middle');

      // Add inner circles with gradient
      const innerColorScale = d3.scaleSequential()
        .domain([0, data.length])
        .interpolator(d3.interpolateHcl('#F72585', '#7209B7'));

      svg.append('g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('fill', (_, i) => innerColorScale(i))
        .attr('class', 'inner-circle')
        .attr('d', d3.arc<DataPoint>()
          .innerRadius(() => ybis(0))
          .outerRadius(d => ybis(d.Value))
          .startAngle(d => x(d.Country)!)
          .endAngle(d => x(d.Country)! + x.bandwidth()!)
          .padAngle(0.01)
          .padRadius(innerRadius))
        .style('filter', 'drop-shadow(0 0 2px rgba(0,0,0,0.3))')
        .on('mouseover', (event, d) => {
          // Create tooltip
          d3.select('body')
            .selectAll('.tooltip')
            .data([null])
            .join('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .html(`
              <strong>${d.Country}</strong><br/>
              <strong>Value:</strong> ${d.Value.toLocaleString()}
            `)
            .style('left', (event.pageX + 12) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mousemove', (event) => {
          d3.select('.tooltip')
            .style('left', (event.pageX + 12) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', () => {
          d3.select('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
        });
    };

    if (data) {
      createVisualization(data);
    } else {
      d3.csv(dataUrl, (d) => ({
        Country: String(d.Country),
        Value: +d.Value
      })).then(data => {
        if (data) {
          createVisualization(data);
        }
      }).catch(error => {
        console.error('Error loading or parsing data:', error);
      });
    }
  }, [data, dataUrl, width, height]);

  return <div ref={chartRef} className="radial-chart-container" />;
};

export default RadialChart;
