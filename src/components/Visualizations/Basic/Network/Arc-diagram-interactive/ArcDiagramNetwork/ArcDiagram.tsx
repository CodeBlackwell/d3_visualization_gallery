import React, { useEffect, useRef } from 'react';
import useArcDiagram from '../hooks/useArcDiagram';
import { ARC_CONFIG, VISUALIZATIONS } from '../../../../../../../src/constants/visualizationConfig';
import './ArcDiagram.css';

interface ArcDiagramProps {
  className?: string;
}

const ArcDiagram: React.FC<ArcDiagramProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createVisualization } = useArcDiagram();
  const vizConfig = VISUALIZATIONS.find(viz => viz.id === 'arc');

  useEffect(() => {
    console.log('ArcDiagram mounting...');
    console.log('Container ref:', containerRef.current);
    console.log('Visualization config:', vizConfig);
    console.log('ARC_CONFIG:', ARC_CONFIG);

    if (!containerRef.current) {
      console.error('Container ref is null');
      return;
    }

    if (!vizConfig) {
      console.error('Arc diagram configuration not found');
      return;
    }

    const initVisualization = async () => {
      try {
        console.log('Initializing visualization...');
        await createVisualization(containerRef.current!, {
          ...vizConfig,
          dimensions: ARC_CONFIG.dimensions,
          styles: ARC_CONFIG.styles
        });
        console.log('Visualization created successfully');
      } catch (error) {
        console.error('Error in ArcDiagram component:', error);
      }
    };

    initVisualization();

    return () => {
      console.log('ArcDiagram unmounting...');
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [createVisualization, vizConfig]);

  if (!vizConfig) {
    return (
      <div className="error-message">
        Arc diagram configuration not found
      </div>
    );
  }

  return (
    <div className={`visualization-container ${className || ''}`}>
      <div 
        ref={containerRef} 
        className="arc-diagram"
        style={{ 
          width: '100%', 
          height: '600px',
          border: '1px solid #ccc',
          padding: '20px',
          position: 'relative'
        }}
      >
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            display: 'none'
          }} 
          className="loading-indicator"
        >
          Loading visualization...
        </div>
      </div>
    </div>
  );
};

export default ArcDiagram;
