export interface Visualization {
  id: string;
  name: string;
  description: string;
  dataUrl: string;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Dimensions {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;
}

export interface StyleConfig {
  link: {
    defaultColor: string;
    highlightColor: string;
    defaultWidth: number;
    highlightWidth: number;
  };
  node: {
    defaultOpacity: number;
    dimmedOpacity: number;
  };
  label: {
    defaultSize: number;
    highlightSize: number;
  };
}

export interface ArcConfig {
  dimensions: Dimensions;
  styles: {
    link: {
      defaultColor: string;
      highlightColor: string;
      defaultWidth: number;
      highlightWidth: number;
    };
    node: {
      defaultOpacity: number;
      dimmedOpacity: number;
    };
    label: {
      defaultSize: number;
      highlightSize: number;
    };
  };
}

export interface WorldMapConfig {
  dimensions: Dimensions;
  styles: {
    country: {
      defaultFill: string;
      hoverFill: string;
      stroke: string;
      strokeWidth: number;
    };
  };
}

export interface ScatterplotConfig {
  dimensions: Dimensions;
  styles: {
    point: {
      radius: number;
      defaultOpacity: number;
      hoverOpacity: number;
      defaultColor: string;
      hoverColor: string;
    };
    axis: {
      fontSize: number;
      color: string;
    };
    grid: {
      color: string;
      opacity: number;
    };
  };
}
