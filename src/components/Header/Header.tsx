import React, { useState } from 'react';
import './Header.css';
import { FaChevronDown } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="site-title">D3 Visualization Gallery</h1>
        <nav className="nav-menu">
          <a href="/" className="nav-link">Home</a>
          <div 
            className="dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="nav-link datasets-button">
              Datasets
              <FaChevronDown className="dropdown-icon" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">Dataset 1</a>
                <a href="#" className="dropdown-item">Dataset 2</a>
                <a href="#" className="dropdown-item">Dataset 3</a>
              </div>
            )}
          </div>
          <a href="/about" className="nav-link">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
