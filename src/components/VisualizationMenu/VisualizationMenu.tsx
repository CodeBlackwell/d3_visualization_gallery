import React from 'react';
import './VisualizationMenu.css';

interface Visualization {
  id: string;
  title: string;
}

interface VisualizationMenuProps {
  visualizations: Visualization[];
  selectedViz: string;
  onSelect: (vizId: string) => void;
}

const VisualizationMenu: React.FC<VisualizationMenuProps> = ({
  visualizations,
  selectedViz,
  onSelect,
}) => {
  return (
    <div className="visualization-menu">
      <select
        value={selectedViz}
        onChange={(e) => onSelect(e.target.value)}
        aria-label="Select visualization"
        className="visualization-select"
      >
        {visualizations.map((viz) => (
          <option key={viz.id} value={viz.id}>
            {viz.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VisualizationMenu;
