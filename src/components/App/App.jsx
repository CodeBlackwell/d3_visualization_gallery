import React from 'react';
import NetworkVisualization from '../NetworkVisualization/NetworkVisualization';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React D3 Visualization</h1>
      </header>
      <main className="app-main">
        <NetworkVisualization />
      </main>
    </div>
  );
}

export default App;
