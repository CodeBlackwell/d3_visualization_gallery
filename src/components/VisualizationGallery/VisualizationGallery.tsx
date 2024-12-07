import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArcDiagram from '../Visualizations/Basic/Network/Arc-diagram-interactive/ArcDiagramNetwork/ArcDiagram';
import WorldMap from '../Visualizations/Basic/WorldMap/Projection2D/WorldMap';
import VisualizationMenu from '../VisualizationMenu/VisualizationMenu';
import VisualizationContainer from '../shared/VisualizationContainer/VisualizationContainer';
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
        return (
          <VisualizationContainer
            title="Arc Diagram"
            description="Arc diagram visualization of researcher connections using D3.js"
          >
            <ArcDiagram />
          </VisualizationContainer>
        );
      case 'world-map':
        return (
          <VisualizationContainer
            title="World Map"
            description="2D world map projection showing geographical data"
          >
            <WorldMap />
          </VisualizationContainer>
        );
      case 'force':
        return (
          <VisualizationContainer
            title="Force-Directed Graph"
            description="Coming soon!"
          >
            <div className="coming-soon">
              <h3>Force-Directed Graph</h3>
              <p>Coming soon! This visualization will show interactive network relationships.</p>
            </div>
          </VisualizationContainer>
        );
      case 'tree':
        return (
          <VisualizationContainer
            title="Tree Visualization"
            description="Coming soon!"
          >
            <div className="coming-soon">
              <h3>Tree Visualization</h3>
              <p>Coming soon! This visualization will display hierarchical data with collapsible nodes.</p>
            </div>
          </VisualizationContainer>
        );
      case 'bubble':
        return (
          <VisualizationContainer
            title="Bubble Chart"
            description="Coming soon!"
          >
            <div className="coming-soon">
              <h3>Bubble Chart</h3>
              <p>Coming soon! This visualization will show data proportions with interactive tooltips.</p>
            </div>
          </VisualizationContainer>
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
      <div className="visualization-display">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationGallery;
