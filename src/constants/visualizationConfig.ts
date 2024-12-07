// Available visualizations
import { Visualization, ArcConfig } from '../types/visualization';

export const VISUALIZATIONS: Visualization[] = [
  {
    id: 'arc',
    name: 'Arc Diagram',
    description: 'Arc diagram visualization of researcher connections using D3.js',
    dataUrl: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_researcherNetwork.json',
  },
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
      defaultSize: 6,
      highlightSize: 16
    }
  }
};
