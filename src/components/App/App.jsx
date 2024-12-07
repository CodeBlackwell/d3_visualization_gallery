import React from 'react';
import VisualizationGallery from '../VisualizationGallery/VisualizationGallery';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>D3 Visualization Gallery</h1>
      </header>
      <main className="app-main">
        <VisualizationGallery />
      </main>
    </div>
  );
}

export default App;
