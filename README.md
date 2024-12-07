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
4. Dark theme with responsive design and smooth animations

## 🌟 Features

- 📊 Interactive D3.js visualizations
- 💪 Full TypeScript support
- 🔄 React component architecture
- 🎨 Modern dark theme with gold accents
- 🛠️ Easy-to-use visualization selector
- 📱 Responsive design
- 🐛 Comprehensive error handling

## 🎬 Current Visualizations

### 🔄 Arc Diagram
- Network visualization showing researcher connections
- Interactive node highlighting with tooltips
- Smooth transitions and hover effects
- Dark theme with gold accent colors
- Responsive SVG scaling

### 🔀 Force-Directed Graph (Coming Soon)
- Interactive network relationships
- Dynamic force simulation
- Node dragging and zooming capabilities

### 🌳 Tree Visualization (Coming Soon)
- Hierarchical data representation
- Collapsible nodes for data exploration
- Smooth transitions between states

### 💫 Bubble Chart (Coming Soon)
- Data proportion visualization
- Interactive tooltips
- Dynamic size scaling

## 📁 Project Structure

```
src/
├── components/
│   ├── Basic/
│   │   └── Network/
│   │       └── Arc-diagram-interactive/
│   │           ├── ArcDiagramNetwork/
│   │           │   ├── ArcDiagram.tsx
│   │           │   └── ArcDiagram.css
│   │           └── hooks/
│   │               └── useArcDiagram.ts
│   ├── Header/
│   ├── Footer/
│   └── VisualizationGallery/
├── constants/
├── types/
└── App.tsx
```

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
