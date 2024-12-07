export const arcDiagramTheme = {
  background: {
    primary: '#2d3748',    // Container background
    surface: 'var(--color-surface)',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
  node: {
    default: '#4A5568',    // Default node color
    hover: '#C1A15A',      // Node hover color
    stroke: '#ffffff',     // Node border color
  },
  link: {
    default: '#4A5568',    // Default link color
    hover: '#C1A15A',      // Link hover color
    opacity: {
      default: 0.4,
      hover: 0.8,
    }
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    default: '#9CA3AF',    // Default text color
    hover: '#ffffff',      // Text hover color
  },
  border: {
    default: 'var(--color-border)',
  }
};
