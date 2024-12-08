import React from 'react';
import './DataStructureExplanation.css';

export interface DataStructureInfo {
  type: string;
  name: string;
  description: string;
  properties?: {
    label: string;
    value: string;
  }[];
}

interface DataStructureExplanationProps {
  dataStructure: DataStructureInfo;
  className?: string;
}

const DataStructureExplanation: React.FC<DataStructureExplanationProps> = ({
  dataStructure,
  className = ''
}) => {
  const { name, description, properties } = dataStructure;

  return (
    <div className={`data-structure-explanation ${className}`}>
      <div className="data-structure-header">
        <h2>{name}</h2>
      </div>
      <div className="data-structure-content">
        <p className="description">{description}</p>
        {properties && properties.length > 0 && (
          <div className="properties">
            {properties.map((prop, index) => (
              <div key={index} className="property">
                <span className="property-label">{prop.label}:</span>
                <span className="property-value">{prop.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataStructureExplanation;
