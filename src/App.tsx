import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VisualizationGallery from './components/VisualizationGallery/VisualizationGallery';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <VisualizationGallery />
      </main>
      <Footer />
    </div>
  );
};

export default App;
