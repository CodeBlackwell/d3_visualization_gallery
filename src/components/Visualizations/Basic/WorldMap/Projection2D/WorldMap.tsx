import React, { useEffect, useRef } from 'react';
import useWorldMap from './hooks/useWorldMap';
import { WORLD_MAP_CONFIG } from '../../../../../constants/visualizationConfig';
import './WorldMap.css';

interface WorldMapProps {
  className?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createVisualization } = useWorldMap();

  useEffect(() => {
    console.log('WorldMap component mounted');
    if (!containerRef.current) {
      console.error('Container ref is null');
      return;
    }

    const initVisualization = async () => {
      console.log('Initializing visualization with config:', WORLD_MAP_CONFIG);
      try {
        await createVisualization(containerRef.current!, WORLD_MAP_CONFIG);
        console.log('Visualization created successfully');
      } catch (error) {
        console.error('Error in WorldMap component:', error);
      }
    };

    initVisualization();

    return () => {
      console.log('WorldMap component unmounting...');
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [createVisualization]);

  return (
    <div 
      ref={containerRef} 
      className={`world-map-container ${className || ''}`}
    />
  );
};

export default WorldMap;
