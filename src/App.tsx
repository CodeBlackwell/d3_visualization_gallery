import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VisualizationGallery from './components/VisualizationGallery/VisualizationGallery';
import About from './components/About/About';
import GlobalHealthExploration from './components/Datasets/GlobalHealth/GlobalHealthExploration';
import AlgorithmExploration from './components/shared/AlgorithmExploration/AlgorithmExploration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VisualizationGallery />} />
            <Route path="/visualization/:id" element={<VisualizationGallery />} />
            <Route path="/datasetexploration/globalhealth" element={<GlobalHealthExploration />} />
            <Route path="/datastructures/:category/:type/:algorithm?" element={<AlgorithmExploration />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
