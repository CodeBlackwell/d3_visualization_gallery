export interface DataStructureBase {
  type: string;
  name: string;
  description: string;
  properties?: {
    label: string;
    value: string;
  }[];
}

export interface VisualizationState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
}

export interface AlgorithmStep {
  current: number;
  total: number;
  description: string;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
  visualizationState?: VisualizationState;
  steps?: AlgorithmStep;
}
