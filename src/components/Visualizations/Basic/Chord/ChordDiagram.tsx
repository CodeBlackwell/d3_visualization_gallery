import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ChordDiagramProps {
  width?: number;
  height?: number;
  dataUrl?: string;
}

interface ChordData {
  matrix: number[][];
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({
  width = 440,
  height = 440,
  dataUrl = '/sample-chord-data.json'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const createVisualization = async () => {
      if (!svgRef.current) return;

      try {
        setLoading(true);
        setError(null);

        // Clear any existing visualization
        d3.select(svgRef.current).selectAll('*').remove();

        // Create the SVG group with proper transformation
        const svg = d3.select(svgRef.current)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        // Fetch and process data
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${dataUrl}`);
        }
        const data: ChordData = await response.json();
        const matrix = data.matrix;

        // Create the chord diagram
        const res = d3.chord()
          .padAngle(0.05)
          .sortSubgroups(d3.descending)(matrix);

        // Add the groups (outer arcs)
        const arcGroups = svg.append('g')
          .selectAll('g')
          .data(res.groups)
          .join('g');

        arcGroups.append('path')
          .style('fill', '#69b3a2')
          .style('stroke', 'black')
          .attr('d', d3.arc<any, typeof res.groups[0]>()
            .innerRadius(180)
            .outerRadius(190)
          );

        // Add the chords (inner ribbons)
        svg.append('g')
          .selectAll('path')
          .data(res)
          .join('path')
          .attr('d', d3.ribbon<any, d3.Chord>()
            .radius(180)
          )
          .style('fill', '#69b3a2')
          .style('opacity', 0.7)
          .style('stroke', '#000');

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    createVisualization();

    // Cleanup function
    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }
    };
  }, [width, height, dataUrl]); // Re-run effect when these props change

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}>
      {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Loading...</div>}
      {error && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red' }}>{error}</div>}
      <svg 
        ref={svgRef}
        className="chord-diagram"
        style={{ width: '100%', height: '100%' }}
        aria-label="Chord Diagram Visualization"
      />
    </div>
  );
};

export default ChordDiagram;