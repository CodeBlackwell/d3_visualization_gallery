import React from 'react';
import './VisualizationContainer.css';

interface VisualizationContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  children,
  title,
  description
}) => {
  return (
    <div className="visualization-container">
      {title && <h2 className="visualization-title">{title}</h2>}
      {description && <p className="visualization-description">{description}</p>}
      <div className="visualization-content">
        {children}
      </div>
    </div>
  );
};

export default VisualizationContainer;
