import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>A Curated Collection of Data Visualizations</h1>
        <p>Explore interactive visualizations built with D3.js, showcasing the power of data-driven storytelling</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">5+</span>
            <span className="stat-label">Visualizations</span>
          </div>
          <div className="stat">
            <span className="stat-number">1M+</span>
            <span className="stat-label">Data Points</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Interactive</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
