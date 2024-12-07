import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Scatterplot.css';

interface DataPoint {
  x: number;
  y: number;
  category: string;
  GrLivArea?: number;
  SalePrice?: number;
}

interface ScatterplotProps {
  data?: DataPoint[];
  dataUrl?: string;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export const Scatterplot: React.FC<ScatterplotProps> = ({
  data,
  dataUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv',
  width = 928,
  height = 600,
  xLabel = "X Axis",
  yLabel = "Y Axis"
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    // Remove any existing tooltips
    d3.select('body').selectAll('.tooltip').remove();

    const createPlot = (plotData: DataPoint[]) => {
      // Create scales
      const x = d3.scaleLinear()
        .domain(d3.extent(plotData, d => d.x) as [number, number])
        .nice()
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain(d3.extent(plotData, d => d.y) as [number, number])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal<string>()
        .domain([...new Set(plotData.map(d => d.category))])
        .range(d3.schemeCategory10);

      // Add X axis
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .call(g => g.append("text")
          .attr("x", width - margin.right)
          .attr("y", -4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

      // Add Y axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.append("text")
          .attr("x", 4)
          .attr("y", margin.top)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

      // Add grid
      svg.append("g")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g.append("g")
          .selectAll("line")
          .data(x.ticks())
          .join("line")
            .attr("x1", d => 0.5 + x(d))
            .attr("x2", d => 0.5 + x(d))
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom))
        .call(g => g.append("g")
          .selectAll("line")
          .data(y.ticks())
          .join("line")
            .attr("y1", d => 0.5 + y(d))
            .attr("y2", d => 0.5 + y(d))
            .attr("x1", margin.left)
            .attr("x2", width - margin.right));

      // Add dots
      svg.append("g")
        .selectAll("circle")
        .data(plotData)
        .join("circle")
          .attr("cx", (d: DataPoint) => x(d.x))
          .attr("cy", (d: DataPoint) => y(d.y))
          .attr("r", 4)
          .attr("fill", (d: DataPoint) => color(d.category))
          .attr("opacity", 0.7)
          .on("mouseover", (event: MouseEvent, d: DataPoint) => {
            // Create tooltip
            const tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

            // Show tooltip with transition
            tooltip.transition()
              .duration(200)
              .style('opacity', .9);

            tooltip.html(`
              <strong>${xLabel}:</strong> ${d.GrLivArea?.toLocaleString() || d.x.toLocaleString()}<br/>
              <strong>${yLabel}:</strong> ${d.SalePrice ? `$${d.SalePrice.toLocaleString()}` : d.y.toLocaleString()}
              ${d.category !== 'default' ? `<br/><strong>Category:</strong> ${d.category}` : ''}
            `)
              .style('left', (event.pageX + 12) + 'px')
              .style('top', (event.pageY - 10) + 'px');

            // Highlight the point
            d3.select(event.currentTarget as SVGCircleElement)
              .transition()
              .duration(200)
              .attr('opacity', 1)
              .attr('stroke', '#000')
              .attr('stroke-width', 1);
          })
          .on("mouseout", (event) => {
            // Remove tooltip
            d3.select('body')
              .selectAll('.tooltip')
              .remove();

            // Remove highlight
            d3.select(event.currentTarget as SVGCircleElement)
              .transition()
              .duration(200)
              .attr('opacity', 0.7)
              .attr('stroke', 'none');
          });

      // Add legend
      const legendSpacing = 20;
      const legendGroup = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .attr("transform", `translate(${width - margin.right + 10},${margin.top})`);

      const legendItems = legendGroup.selectAll("g")
        .data(color.domain())
        .join("g")
        .attr("transform", (d, i) => `translate(0,${i * legendSpacing})`);

      legendItems.append("circle")
        .attr("r", 4)
        .attr("fill", d => color(d));

      legendItems.append("text")
        .attr("x", 8)
        .attr("y", 4)
        .text(d => d);
    };

    if (data) {
      createPlot(data);
    } else if (dataUrl) {
      d3.csv(dataUrl).then((csvData: any) => {
        // Transform CSV data to match our DataPoint interface
        const transformedData: DataPoint[] = csvData.map((d: any) => ({
          x: +d.GrLivArea || 0,
          y: +d.SalePrice || 0,
          category: 'default',
          GrLivArea: +d.GrLivArea || 0,
          SalePrice: +d.SalePrice || 0
        }));
        createPlot(transformedData);
      }).catch(error => {
        console.error('Error loading or parsing data:', error);
      });
    }

  }, [data, dataUrl, width, height, xLabel, yLabel]);

  return (
    <div className="scatterplot">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default Scatterplot;