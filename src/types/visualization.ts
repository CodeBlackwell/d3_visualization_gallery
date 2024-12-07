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
  margin: Margin;
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
  styles: StyleConfig;
}

export interface WorldMapConfig {
  dimensions: {
    margin: { top: number; right: number; bottom: number; left: number };
    width: number;
    height: number;
  };
  styles: {
    country: {
      defaultFill: string;
      hoverFill: string;
      stroke: string;
      strokeWidth: number;
    };
  };
}
