import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import VisualizationGallery from '../VisualizationGallery/VisualizationGallery';
import './App.css';

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
