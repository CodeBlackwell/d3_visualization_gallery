import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useNetworkVisualization from '../../hooks/useNetworkVisualization';
import './NetworkVisualization.css';

const NetworkVisualization = ({ className }) => {
  const containerRef = useRef(null);
  const { createVisualization } = useNetworkVisualization();

  useEffect(() => {
    if (containerRef.current) {
      createVisualization(containerRef.current);
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
  }, [createVisualization]);

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
