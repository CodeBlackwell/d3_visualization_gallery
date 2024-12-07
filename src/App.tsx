import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VisualizationGallery from './components/VisualizationGallery/VisualizationGallery';
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
