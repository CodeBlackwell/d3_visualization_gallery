import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetworkVisualization from '../../hooks/useNetworkVisualization';
import { VISUALIZATIONS } from '../../constants/visualizationConfig';
import './NetworkVisualization.css';

const NetworkVisualization = ({ className }) => {
  const containerRef = useRef(null);
  const { createVisualization } = useNetworkVisualization();
  const config = VISUALIZATIONS.find(viz => viz.id === 'network');

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
        className="network-visualization"
      />
    </div>
  );
};

NetworkVisualization.propTypes = {
  className: PropTypes.string
};

export default NetworkVisualization;
