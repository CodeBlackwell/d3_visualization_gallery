import React from 'react';
import './AlgorithmExplanation.css';

export interface AlgorithmInfo {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
  steps?: {
    current: number;
    total: number;
    description: string;
  };
  visualizationState?: {
    isPlaying: boolean;
    currentStep: number;
    speed: number;
  };
}

interface AlgorithmExplanationProps {
  algorithm: AlgorithmInfo;
  availableAlgorithms: { id: string; name: string }[];
  onAlgorithmChange: (algorithmId: string) => void;
  onSpeedChange?: (speed: number) => void;
  onStepChange?: (step: number) => void;
  className?: string;
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({
  algorithm,
  availableAlgorithms,
  onAlgorithmChange,
  onSpeedChange,
  onStepChange,
  className = ''
}) => {
  const {
    id,
    name,
    description,
    timeComplexity,
    spaceComplexity,
    pseudocode,
    steps,
    visualizationState
  } = algorithm;

  return (
    <div className={`algorithm-explanation ${className}`}>
      <div className="algorithm-header">
        <div className="algorithm-selector">
          <select
            value={id}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            className="algorithm-select"
          >
            {availableAlgorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>
        {visualizationState && (
          <div className="visualization-controls">
            <select
              value={visualizationState.speed}
              onChange={(e) => onSpeedChange?.(Number(e.target.value))}
              className="speed-control"
            >
              <option value={2000}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
              <option value={250}>Very Fast</option>
            </select>
          </div>
        )}
      </div>

      <div className="algorithm-section">
        <h3>Description</h3>
        <p>{description}</p>
      </div>

      <div className="algorithm-section">
        <h3>Complexity Analysis</h3>
        <div className="complexity-info">
          <p>
            <strong>Time Complexity:</strong> {timeComplexity}
          </p>
          <p>
            <strong>Space Complexity:</strong> {spaceComplexity}
          </p>
        </div>
      </div>

      <div className="algorithm-section">
        <h3>Pseudocode</h3>
        <div className="pseudocode">
          {pseudocode.map((line, index) => (
            <div
              key={index}
              className={`pseudocode-line ${
                steps?.current === index ? 'current-step' : ''
              }`}
            >
              <span className="line-number">{index + 1}</span>
              <code>{line}</code>
            </div>
          ))}
        </div>
      </div>

      {steps && (
        <div className="algorithm-section">
          <h3>Progress</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(steps.current / steps.total) * 100}%`
              }}
            />
          </div>
          <p className="step-description">{steps.description}</p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmExplanation;
