# 🎨 D3 Visualization Gallery - LLM Training Dataset

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> 🚀 A comprehensive collection of production-ready D3.js visualizations implemented in React and TypeScript, designed to train Large Language Models (LLMs) in generating functional visualizations from natural language queries.

## 🎯 Project Objective

This project aims to create a robust dataset of D3.js visualizations that can be used to train LLMs, featuring:

1. Production-ready, fully implemented visualizations of varying complexity
2. Clean, type-safe TypeScript code with React integration
3. Comprehensive documentation of visualization parameters and usage
4. Wide range of visualization types and complexity levels
5. Structured data format suitable for LLM training
6. Natural language descriptions paired with functional code

The ultimate goal is to enable LLMs to understand and generate accurate, functional D3.js visualizations based on natural language descriptions and requirements.

## 🌟 Features

- 📊 Interactive D3.js visualizations
- 💪 Full TypeScript support
- 🔄 React component architecture
- 🎨 Modern dark theme with gold accents
- 🛠️ Easy-to-use visualization selector
- 📱 Responsive design
- 🐛 Comprehensive error handling

## 🎬 Visualization Dataset Categories

Our dataset is organized into progressive complexity levels to facilitate structured learning for LLMs:

### 🔰 Basic Visualizations
- **Bar Charts & Histograms**
  - Simple data distribution visualization
  - Axis handling and scale transformations
  - Data binning and aggregation techniques
  
- **Line & Area Charts**
  - Time series data representation
  - Multiple series handling
  - Interpolation methods
  
- **Scatter Plots**
  - 2D data point visualization
  - Color and size encoding
  - Zoom and pan interactions

### 🔄 Intermediate Network Visualizations
- **Force-Directed Graphs**
  - Node-link relationship visualization
  - Force simulation parameters
  - Interactive node dragging
  
- **Arc Diagrams**
  - Linear network layout
  - Edge bundling techniques
  - Node clustering strategies
  
- **Tree Layouts**
  - Hierarchical data structures
  - Collapsible tree interactions
  - Parent-child relationships

### 🎯 Advanced Data Structures
- **Complex Network Visualizations**
  - Multi-level force layouts
  - Dynamic graph updates
  - Large-scale data handling
  
- **Sankey Diagrams**
  - Flow visualization
  - Node ranking
  - Interactive flow tracing

### 🧮 Algorithm Visualizations
- **Pathfinding Algorithms**
  - Step-by-step execution
  - State management
  - Algorithm comparison views
  
- **Sorting Visualizations**
  - Array manipulation
  - Transition animations
  - Performance metrics

Each visualization category includes:
- 📝 Detailed implementation documentation
- 🎨 Customizable styling options
- 🔧 Configuration parameters
- 📊 Sample datasets
- 🧪 Test cases
- 💡 Natural language descriptions
- 🔄 Interactive features

This structured approach enables LLMs to learn:
1. Progressive complexity in visualization implementation
2. Common patterns and best practices
3. Data structure relationships
4. Interactive feature implementation
5. Performance optimization techniques

## 📁 Project Structure

```
src/
├── components/
│   ├── Visualizations/          # Core visualization components
│   │   ├── Basic/              # Simple, foundational visualizations
│   │   └── DeepDive/           # Complex, advanced visualizations
│   ├── DataStructures/         # Reusable data structure implementations
│   │   ├── Graph/              # Graph-based visualization components
│   │   └── types.ts           # TypeScript type definitions
│   ├── shared/                 # Shared visualization components
│   │   ├── AlgorithmExploration/     # Interactive algorithm demonstrations
│   │   ├── DatasetExploration/       # Dataset visualization tools
│   │   ├── GraphVisualization/       # Graph rendering components
│   │   └── VisualizationContainer/   # Container components
│   └── VisualizationGallery/   # Gallery interface components
├── constants/                  # Configuration and theme settings
│   ├── dataStructureConfig.ts  # Data structure configurations
│   ├── visualizationConfig.ts  # Visualization parameters
│   └── visualizationTheme.ts   # Theming and styling constants
├── hooks/                      # Custom React hooks
├── services/                   # Data processing and API services
├── types/                      # TypeScript type definitions
└── utils/                      # Utility functions and helpers
```

### 📊 Dataset Organization

Each visualization in the dataset includes:
1. **Implementation Files**: TypeScript/React components with D3.js integration
2. **Type Definitions**: Comprehensive TypeScript interfaces and types
3. **Natural Language Descriptions**: Detailed descriptions of visualization purpose and behavior
4. **Configuration Options**: Customizable parameters and their effects
5. **Usage Examples**: Sample implementations with varying complexity levels
6. **Test Cases**: Validation scenarios and edge cases

This structure is designed to provide LLMs with:
- Clear relationships between natural language requirements and implementation code
- Progressive complexity levels for learning visualization patterns
- Consistent patterns in component organization and implementation
- Rich context for understanding visualization architecture and best practices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/d3-visualization-gallery.git

# Navigate to project directory
cd d3-visualization-gallery

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Development

### Adding New Visualizations
1. Create a new directory under `src/components/` for your visualization category
2. Add your visualization component and related files
3. Update `visualizationConfig.ts` with your new visualization details
4. Add the visualization to the gallery renderer

### Styling Guidelines
- Use the provided color variables for consistency
- Follow the dark theme pattern
- Ensure responsive design
- Add smooth transitions for interactions

## 🔧 Adding New Visualizations

To add a new visualization to the gallery, follow these steps:

### 1. Create the Visualization Component

Create a new directory under `src/components/Visualizations/Basic/` with your visualization name:

```
src/components/Visualizations/Basic/
└── YourVisualization/
    ├── YourVisualization.tsx      # Main component
    ├── YourVisualization.css      # Styles
    └── hooks/
        └── useYourVisualization.ts # D3.js logic
```

### 2. Configure the Visualization

Add your visualization to `src/constants/visualizationConfig.ts`:

```typescript
export const VISUALIZATIONS: Visualization[] = [
  // ... existing visualizations
  {
    id: 'your-visualization-id',
    name: 'Your Visualization Name',
    description: 'Brief description of your visualization',
    dataUrl: 'URL to your data source if applicable',
  },
];

// Add configuration if needed
export const YOUR_VIZ_CONFIG: YourVizConfig = {
  dimensions: {
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    width: 800,
    height: 600
  },
  styles: {
    // Your visualization-specific styles
  }
};
```

### 3. Add TypeScript Types

Define your visualization's types in `src/types/visualization.ts`:

```typescript
export interface YourVizConfig {
  dimensions: {
    margin: { top: number; right: number; bottom: number; left: number };
    width: number;
    height: number;
  };
  styles: {
    // Your visualization-specific style types
  };
}
```

### 4. Register in the Gallery

Add your visualization to the switch statement in `src/components/VisualizationGallery/VisualizationGallery.tsx`:

```typescript
import YourVisualization from '../Visualizations/Basic/YourVisualization/YourVisualization';

// In the renderVisualization function:
case 'your-visualization-id':
  return <YourVisualization />;
```

### 5. Best Practices

- Use TypeScript for type safety
- Implement error handling for data loading
- Add loading states and error messages
- Make the visualization responsive
- Follow the existing component structure:
  - Use a custom hook for D3.js logic
  - Keep the React component clean
  - Separate styles into a CSS file
  - Add proper cleanup in useEffect hooks

### 6. Testing

- Add your visualization to the test suite
- Test with different screen sizes
- Verify error handling
- Check memory leaks with React DevTools
- Test data loading states

## 🎨 Color Palette

```css
--color-background: #1D1F21;
--color-surface: #16181A;
--color-primary: #C1A15A;
--color-text: #FFFFFF;
--color-text-secondary: #9CA3AF;
--color-border: #2D3748;
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
