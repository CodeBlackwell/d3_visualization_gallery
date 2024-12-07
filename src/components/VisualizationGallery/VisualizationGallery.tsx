import React, { useState } from 'react';
import ArcDiagram from '../Basic/Network/Arc-diagram-interactive/ArcDiagramNetwork/ArcDiagram';
import VisualizationMenu from '../VisualizationMenu/VisualizationMenu';
import { VISUALIZATIONS } from '../../constants/visualizationConfig';
import './VisualizationGallery.css';

const VisualizationGallery: React.FC = () => {
  const [selectedViz, setSelectedViz] = useState<string>(VISUALIZATIONS[0].id);

  const renderVisualization = (): React.ReactNode => {
    switch (selectedViz) {
      case 'arc':
        return <ArcDiagram />;
      case 'force':
        return (
          <div className="coming-soon">
            <h3>Force-Directed Graph</h3>
            <p>Coming soon! This visualization will show interactive network relationships.</p>
          </div>
        );
      case 'tree':
        return (
          <div className="coming-soon">
            <h3>Tree Visualization</h3>
            <p>Coming soon! This visualization will display hierarchical data with collapsible nodes.</p>
          </div>
        );
      case 'bubble':
        return (
          <div className="coming-soon">
            <h3>Bubble Chart</h3>
            <p>Coming soon! This visualization will show data proportions with interactive tooltips.</p>
          </div>
        );
      default:
        return (
          <div className="no-visualization">
            <p>Select a visualization from the menu above</p>
          </div>
        );
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
