import React from 'react';
import './Footer.css';
import { FaChartBar, FaDatabase, FaMousePointer } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <h2 className="footer-tagline">A Curated Collection of Data Visualizations</h2>
        
        <div className="metrics">
          <div className="metric" aria-label="Number of visualizations">
            <FaChartBar className="metric-icon" />
            <span className="metric-value">5+</span>
            <span className="metric-label">Visualizations</span>
          </div>
          
          <div className="metric" aria-label="Number of data points">
            <FaDatabase className="metric-icon" />
            <span className="metric-value">1M+</span>
            <span className="metric-label">Data Points</span>
          </div>
          
          <div className="metric" aria-label="Interactivity status">
            <FaMousePointer className="metric-icon" />
            <span className="metric-value">100%</span>
            <span className="metric-label">Interactive</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="https://github.com/yourusername/d3-gallery" 
             aria-label="View project on GitHub"
             className="github-link">
            View on GitHub
          </a>
          <a href="mailto:contact@example.com" 
             aria-label="Contact me via email"
             className="contact-link">
            Contact Me
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
