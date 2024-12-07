import { WorldMapConfig } from '../types/visualization';

// Common SVG configuration
export const SVG_CONFIG = {
  aspectRatio: 'xMidYMid meet' as const,
  getViewBox: (width: number, height: number) => `0 0 ${width} ${height}`,
  dimensions: {
    margin: { top: 20, right: 20, bottom: 60, left: 20 },
    width: 960,
    height: 500
  },
  styles: {
    background: 'var(--color-background)',
    text: {
      color: 'var(--color-text)',
      fontFamily: 'var(--font-body)',
      sizes: {
        small: 12,
        medium: 14,
        large: 16
      }
    },
    tooltip: {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '14px'
    }
  }
};

// World Map specific configuration
export const WORLD_MAP_CONFIG: WorldMapConfig = {
  dimensions: SVG_CONFIG.dimensions,
  styles: {
    country: {
      defaultFill: '#e0e0e0',
      hoverFill: '#a0a0a0',
      stroke: '#ffffff',
      strokeWidth: 0.5
    }
  }
};

// Color scales
export const COLOR_SCALES = {
  sequential: {
    default: ['#fff5eb', '#fd8d3c', '#d94801'], // Orange sequential
    health: ['#ffffcc', '#fd8d3c', '#800026'],  // Yellow to Red (health data)
    positive: ['#edf8e9', '#74c476', '#006d2c'], // Green sequential
    negative: ['#fee5d9', '#fc4e2a', '#a50f15']  // Red sequential
  },
  diverging: {
    default: ['#2166ac', '#f7f7f7', '#b2182b'], // Blue to Red
    health: ['#2c7bb6', '#ffffbf', '#d7191c']   // Blue to Red (health specific)
  }
};

// Transition configurations
export const TRANSITIONS = {
  default: {
    duration: 200,
    ease: 'ease-in-out'
  },
  slow: {
    duration: 500,
    ease: 'ease-in-out'
  },
  fast: {
    duration: 100,
    ease: 'ease-in-out'
  }
};

// Legend configurations
export const LEGEND_CONFIG = {
  dimensions: {
    width: 200,
    height: 10,
    margin: { top: 10, right: 10, bottom: 25, left: 10 }
  },
  styles: {
    text: {
      fontSize: SVG_CONFIG.styles.text.sizes.small,
      fill: SVG_CONFIG.styles.text.color
    },
    border: {
      stroke: 'var(--color-border)',
      strokeWidth: 1
    }
  }
};

// Responsive breakpoints for SVG visualizations
export const RESPONSIVE_BREAKPOINTS = {
  small: 480,
  medium: 768,
  large: 1024,
  xlarge: 1200
};
