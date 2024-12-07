import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArcDiagram from '../Visualizations/Basic/Network/Arc-diagram-interactive/ArcDiagramNetwork/ArcDiagram';
import VisualizationMenu from '../VisualizationMenu/VisualizationMenu';
import { VISUALIZATIONS } from '../../constants/visualizationConfig';
import './VisualizationGallery.css';

const VisualizationGallery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedViz, setSelectedViz] = useState<string>(id || VISUALIZATIONS[0].id);

  useEffect(() => {
    if (id && id !== selectedViz) {
      setSelectedViz(id);
    }
  }, [id]);

  const handleVisualizationChange = (newViz: string) => {
    setSelectedViz(newViz);
    navigate(`/visualization/${newViz}`);
  };

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
        onSelect={handleVisualizationChange}
      />
      <div className="visualization-container">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationGallery;
