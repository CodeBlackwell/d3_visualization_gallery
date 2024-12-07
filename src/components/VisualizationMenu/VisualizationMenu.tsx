import React from 'react';
import './VisualizationMenu.css';

interface Visualization {
  id: string;
  name: string;
  description: string;
}

interface VisualizationMenuProps {
  visualizations: Visualization[];
  selectedViz: string;
  onSelect: (id: string) => void;
}

const VisualizationMenu: React.FC<VisualizationMenuProps> = ({ 
  visualizations, 
  selectedViz, 
  onSelect 
}) => {
  return (
    <div className="visualization-menu">
      <select 
        value={selectedViz} 
        onChange={(e) => onSelect(e.target.value)}
        className="visualization-select"
      >
        {visualizations.map(viz => (
          <option key={viz.id} value={viz.id}>
            {viz.name}
          </option>
        ))}
      </select>
      <div className="visualization-description">
        {visualizations.find(viz => viz.id === selectedViz)?.description}
      </div>
    </div>
  );
};

export default VisualizationMenu;
