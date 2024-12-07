# 🎨 D3.js Visualization Gallery

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> 🚀 A modern, TypeScript-powered gallery of D3.js visualizations with React components and interactive features.

## 🎯 Project Objective

This project showcases D3.js visualizations in a modern React application, featuring:
1. TypeScript integration for improved type safety and developer experience
2. Modular component architecture for easy extension
3. Interactive visualization gallery with configurable options
4. Responsive design and smooth animations

## 🌟 Features

- 📊 Interactive D3.js visualizations
- 💪 Full TypeScript support
- 🔄 React component architecture
- 🎨 Consistent styling with CSS modules
- 🛠️ Easy-to-use visualization selector
- 📱 Responsive design
- 🐛 Comprehensive error handling

## 🎬 Current Visualizations

### 🌋 Volcano Contours
- Topographic visualization of Maungawhau volcano
- Interactive contour lines with color gradients
- Elevation data representation

### 🔄 Arc Diagram
- Network visualization showing researcher connections
- Interactive node highlighting
- Smooth transitions and animations
- Configurable styling options

*More visualizations coming soon!*

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/CodeBlackwell/t5d3_dataset.git

# Navigate to project directory
cd t5d3_dataset

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/                # React components
│   ├── ArcDiagram/           # Arc diagram visualization
│   │   ├── ArcDiagram.tsx    # Main component
│   │   └── ArcDiagram.css    # Styles
│   └── VisualizationGallery/ # Gallery component
├── constants/                 # Configuration constants
│   └── visualizationConfig.ts # Visualization settings
├── hooks/                    # Custom React hooks
│   └── useArcDiagram.ts     # Arc diagram logic
├── types/                    # TypeScript type definitions
│   └── visualization.ts      # Shared types
└── App.tsx                   # Main application
```

## 🛠️ Component Architecture

### Visualization Gallery
- Main container for all visualizations
- Handles visualization selection and rendering
- Manages state and configuration

### Arc Diagram
- Network visualization component
- Uses D3.js for rendering
- Configurable through props:
  - Data URL
  - Dimensions
  - Styling options
  - Interaction behaviors

### Custom Hooks
- `useArcDiagram`: Manages D3.js visualization lifecycle
- Handles:
  - Data fetching
  - SVG creation
  - Animations
  - Event handling
  - Cleanup

## 🎨 Styling

- CSS modules for component-specific styling
- Consistent theme across visualizations
- Responsive design patterns
- Smooth transitions and animations

## 🔧 Configuration

Visualizations are configured through `visualizationConfig.ts`:
```typescript
export const VISUALIZATIONS: Visualization[] = [
  {
    id: 'arc',
    name: 'Arc Diagram',
    description: 'Network visualization...',
    dataUrl: '...'
  }
];

export const ARC_CONFIG: ArcConfig = {
  dimensions: { ... },
  styles: { ... }
};
```

## 📚 Documentation

- [D3.js Documentation](https://d3js.org/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Guide](https://vitejs.dev/guide/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) for the amazing visualization library
- [React](https://reactjs.org/) for the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- Original notebook authors and contributors

---

<p align="center">Made with ❤️ by <a href="https://github.com/CodeBlackwell">CodeBlackwell</a></p>
