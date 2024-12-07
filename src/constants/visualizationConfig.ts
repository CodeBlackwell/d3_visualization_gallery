// Available visualizations
import { Visualization, ArcConfig, WorldMapConfig, ScatterplotConfig, RadialChartConfig } from '../types/visualization';

export const VISUALIZATIONS: Visualization[] = [
  {
    id: 'arc',
    name: 'Arc Diagram',
    description: 'Arc diagram visualization of researcher connections using D3.js',
    dataUrl: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_researcherNetwork.json',
  },
  {
    id: 'world-map',
    name: 'World Map',
    description: 'Interactive world map visualization using D3.js and TopoJSON',
    dataUrl: 'https://unpkg.com/world-atlas@2/countries-110m.json',
  },
  {
    id: 'scatter',
    name: 'Scatterplot',
    description: 'Interactive scatterplot visualization with D3.js',
    dataUrl: 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv',
  },
  {
    id: 'radial',
    name: 'Radial Chart',
    description: 'Interactive radial chart visualization using D3.js',
    dataUrl: 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv',
  }
  // Add more visualizations here
];

// Arc diagram specific config
export const ARC_CONFIG: ArcConfig = {
  dimensions: {
    margin: { top: 0, right: 30, bottom: 50, left: 60 },
    width: 650,
    height: 400
  },
  styles: {
    link: {
      defaultColor: 'grey',
      highlightColor: '#b8b8b8',
      defaultWidth: 1,
      highlightWidth: 4
    },
    node: {
      defaultOpacity: 1,
      dimmedOpacity: 0.2
    },
    label: {
      defaultSize: 10,
      highlightSize: 20
    }
  }
};

// World map specific config
export const WORLD_MAP_CONFIG: WorldMapConfig = {
  dimensions: {
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    width: 960,
    height: 500
  },
  styles: {
    country: {
      defaultFill: '#e0e0e0',
      hoverFill: '#a0a0a0',
      stroke: '#ffffff',
      strokeWidth: 0.5
    }
  }
};

// Scatterplot specific config
export const SCATTER_CONFIG: ScatterplotConfig = {
  dimensions: {
    margin: { top: 20, right: 30, bottom: 40, left: 40 },
    width: 800,
    height: 500
  },
  styles: {
    point: {
      radius: 4,
      defaultOpacity: 0.7,
      hoverOpacity: 1,
      defaultColor: '#69b3a2',
      hoverColor: '#2a9d8f'
    },
    axis: {
      fontSize: 12,
      color: '#666'
    },
    grid: {
      color: '#ddd',
      opacity: 0.1
    }
  }
};
