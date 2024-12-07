import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArcDiagram from '../Visualizations/Basic/Network/Arc-diagram-interactive/ArcDiagramNetwork/ArcDiagram';
import WorldMap from '../Visualizations/Basic/WorldMap/Projection2D/WorldMap';
import Scatterplot from '../Visualizations/Basic/Scatterplot/Scatterplot';
import RadialChart from '../Visualizations/Basic/RadialChart/RadialChart';
import DatasetExploration from '../shared/DatasetExploration/DatasetExploration';
import { VISUALIZATIONS } from '../../constants/visualizationConfig';
import './../DatasetExploration/DatasetExploration.css'; // Reusable component styles

const galleryConfig = {
  title: "D3 Visualization Gallery",
  description: "A curated collection of interactive data visualizations built with D3.js",
  visualizations: [
    {
      type: 'arc',
      title: "Arc Diagram",
      description: "Arc diagram visualization of researcher connections using D3.js",
      component: <ArcDiagram />
    },
    {
      type: 'world-map',
      title: "World Map",
      description: "2D world map projection showing geographical data",
      component: <WorldMap />
    },
    {
      type: 'scatter',
      title: "Scatterplot",
      description: "Interactive scatterplot visualization with D3.js",
      component: <Scatterplot 
        dataUrl="https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv"
        width={800}
        height={500}
        xLabel="Living Area (m^2)"
        yLabel="Sale Price"
      />
    },
    {
      type: 'radial',
      title: "Radial Chart",
      description: "Interactive radial chart visualization using D3.js",
      component: <RadialChart 
        dataUrl="https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv"
      />
    },
    {
      type: 'force',
      title: "Force-Directed Graph",
      description: "Coming soon!",
      component: <div className="coming-soon">
        <h3>Force-Directed Graph</h3>
        <p>This visualization is coming soon!</p>
      </div>
    },
    {
      type: 'tree',
      title: "Tree Layout",
      description: "Coming soon!",
      component: <div className="coming-soon">
        <h3>Tree Layout</h3>
        <p>This visualization is coming soon!</p>
      </div>
    }
  ]
};

const VisualizationGallery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the index of the visualization based on the URL parameter
  const initialIndex = id ? galleryConfig.visualizations.findIndex(viz => viz.type === id) : 0;

  // Create a wrapped config that includes the navigation logic
  const wrappedConfig = {
    ...galleryConfig,
    visualizations: galleryConfig.visualizations.map((viz, index) => ({
      ...viz,
      onClick: () => navigate(`/visualization/${viz.type}`)
    }))
  };

  return <DatasetExploration config={wrappedConfig} initialVisualization={initialIndex} />;
};

export default VisualizationGallery;
