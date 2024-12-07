import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useArcDiagram from '../../hooks/useArcDiagram';
import { VISUALIZATIONS } from '../../constants/visualizationConfig';
import './ArcDiagram.css';

const ArcDiagram = ({ className }) => {
  const containerRef = useRef(null);
  const { createVisualization } = useArcDiagram();
  const config = VISUALIZATIONS.find(viz => viz.id === 'arc');

  useEffect(() => {
    if (containerRef.current && config) {
      createVisualization(containerRef.current, config);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        const container = containerRef.current;
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [createVisualization, config]);

  if (!config) {
    return <div>Visualization configuration not found</div>;
  }

  return (
    <div className={`visualization-container ${className || ''}`}>
      <div 
        ref={containerRef}
        className="arc-diagram"
      />
    </div>
  );
};

ArcDiagram.propTypes = {
  className: PropTypes.string
};

export default ArcDiagram;
