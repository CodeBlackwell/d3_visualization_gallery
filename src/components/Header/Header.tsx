import React from 'react';
import './Header.css';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
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
          <div className="dropdown-container">
            <button className="datasets-button">
              Data Structures
              <FaChevronDown className="dropdown-icon" />
            </button>
            <div className="dropdown-menu">
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Graph
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/datastructures/graph/directed" className="dropdown-item">Directed Graph</Link>
                  <Link to="/datastructures/graph/undirected" className="dropdown-item">Undirected Graph</Link>
                  <Link to="/datastructures/graph/weighted" className="dropdown-item">Weighted Graph</Link>
                  <Link to="/datastructures/graph/multigraph" className="dropdown-item">MultiGraph</Link>
                  <Link to="/datastructures/graph/disconnected" className="dropdown-item">Disconnected Graph</Link>
                  <Link to="/datastructures/graph/cyclic" className="dropdown-item">Cyclic Graph</Link>
                  <Link to="/datastructures/graph/acyclic" className="dropdown-item">Acyclic Graph (DAG)</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Stack
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/datastructures/stack/basic" className="dropdown-item">Basic Stack</Link>
                  <Link to="/datastructures/stack/min" className="dropdown-item">Min Stack</Link>
                  <Link to="/datastructures/stack/max" className="dropdown-item">Max Stack</Link>
                  <Link to="/datastructures/stack/double" className="dropdown-item">Double-Ended Stack</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Queue
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/datastructures/queue/basic" className="dropdown-item">Basic Queue</Link>
                  <Link to="/datastructures/queue/circular" className="dropdown-item">Circular Queue</Link>
                  <Link to="/datastructures/queue/priority" className="dropdown-item">Priority Queue</Link>
                  <Link to="/datastructures/queue/deque" className="dropdown-item">Double-Ended Queue</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Hashmap
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/datastructures/hashmap/basic" className="dropdown-item">Basic HashMap</Link>
                  <Link to="/datastructures/hashmap/ordered" className="dropdown-item">Ordered HashMap</Link>
                  <Link to="/datastructures/hashmap/multi" className="dropdown-item">MultiMap</Link>
                  <Link to="/datastructures/hashmap/bidirectional" className="dropdown-item">Bidirectional Map</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Tree
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/datastructures/tree/binary" className="dropdown-item">Binary Tree</Link>
                  <Link to="/datastructures/tree/nary" className="dropdown-item">N-ary Tree</Link>
                  <Link to="/datastructures/tree/balanced" className="dropdown-item">Balanced Tree</Link>
                  <Link to="/datastructures/tree/unbalanced" className="dropdown-item">Unbalanced Tree</Link>
                  <Link to="/datastructures/tree/complete" className="dropdown-item">Complete Tree</Link>
                  <Link to="/datastructures/tree/full" className="dropdown-item">Full Binary Tree</Link>
                  <Link to="/datastructures/tree/perfect" className="dropdown-item">Perfect Binary Tree</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Heap
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/datastructures/heap/min" className="dropdown-item">Min Heap</Link>
                  <Link to="/datastructures/heap/max" className="dropdown-item">Max Heap</Link>
                  <Link to="/datastructures/heap/binomial" className="dropdown-item">Binomial Heap</Link>
                  <Link to="/datastructures/heap/fibonacci" className="dropdown-item">Fibonacci Heap</Link>
                  <Link to="/datastructures/heap/pairing" className="dropdown-item">Pairing Heap</Link>
                </div>
              </div>
            </div>
          </div>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
