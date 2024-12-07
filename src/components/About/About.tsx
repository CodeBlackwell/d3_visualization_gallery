import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>About the D3 Visualization Gallery</h1>
      <section className="about-section">
        <h2>Project Overview</h2>
        <p>
          This visualization gallery showcases interactive data visualizations built with D3.js and React.
          Our goal is to present complex datasets in an intuitive and engaging way, helping users understand
          global patterns and trends through interactive visual exploration.
        </p>
      </section>
      
      <section className="about-section">
        <h2>Technologies Used</h2>
        <ul>
          <li>React with TypeScript for robust front-end development</li>
          <li>D3.js for powerful data visualization capabilities</li>
          <li>Modern CSS for responsive and attractive design</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Data Sources</h2>
        <p>
          Our visualizations use data from reputable sources including:
        </p>
        <ul>
          <li>World Health Organization (WHO)</li>
          <li>World Bank Open Data</li>
          <li>United Nations Data</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
