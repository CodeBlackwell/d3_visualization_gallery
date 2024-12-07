import React, { useState } from 'react';
import ArcDiagram from '../ArcDiagram/ArcDiagram';
import VisualizationMenu from '../VisualizationMenu/VisualizationMenu';
import { VISUALIZATIONS } from '../../constants/visualizationConfig';
import './VisualizationGallery.css';

const VisualizationGallery = () => {
  const [selectedViz, setSelectedViz] = useState(VISUALIZATIONS[0].id);

  const renderVisualization = () => {
    switch (selectedViz) {
      case 'arc':
        return <ArcDiagram />;
      // Add more cases for other visualizations
      default:
        return <div>Select a visualization</div>;
    }
  };

  return (
    <div className="visualization-gallery">
      <VisualizationMenu 
        visualizations={VISUALIZATIONS}
        selectedViz={selectedViz}
        onSelect={setSelectedViz}
      />
      <div className="visualization-container">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationGallery;
