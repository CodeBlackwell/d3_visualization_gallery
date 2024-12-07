import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VisualizationGallery from './components/VisualizationGallery/VisualizationGallery';
import About from './components/About/About';
import DatasetExploration from './components/DatasetExploration/DatasetExploration';
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
            <Route path="/datasetexploration/:datasetId" element={<DatasetExploration />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
