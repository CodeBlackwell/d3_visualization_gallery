import React from 'react';
import './Header.css';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="site-title">D3 Visualization Gallery</Link>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <div className="dropdown-container">
            <button className="datasets-button">
              Datasets
              <FaChevronDown className="dropdown-icon" />
            </button>
            <div className="dropdown-menu">
              <Link to="/visualization/arc" className="dropdown-item">Arc Diagram</Link>
              <Link to="/visualization/force" className="dropdown-item">Force-Directed Graph</Link>
              <Link to="/visualization/tree" className="dropdown-item">Tree Visualization</Link>
              <Link to="/visualization/bubble" className="dropdown-item">Bubble Chart</Link>
            </div>
          </div>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
