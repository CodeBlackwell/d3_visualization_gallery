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
              <Link to="/datasetexploration/globalhealth" className="dropdown-item">Global Health Statistics</Link>
            </div>
          </div>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
