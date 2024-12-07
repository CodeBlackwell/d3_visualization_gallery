import React from 'react';
import PropTypes from 'prop-types';
import './VisualizationMenu.css';

const VisualizationMenu = ({ visualizations, selectedViz, onSelect }) => {
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

VisualizationMenu.propTypes = {
  visualizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedViz: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default VisualizationMenu;
