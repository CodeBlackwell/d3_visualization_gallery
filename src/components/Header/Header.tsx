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
              Algorithms
              <FaChevronDown className="dropdown-icon" />
            </button>
            <div className="dropdown-menu">
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Graph
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/algorithms/graph/dfs" className="dropdown-item">Depth-First Search</Link>
                  <Link to="/algorithms/graph/bfs" className="dropdown-item">Breadth-First Search</Link>
                  <Link to="/algorithms/graph/dijkstra" className="dropdown-item">Dijkstra's Algorithm</Link>
                  <Link to="/algorithms/graph/mst" className="dropdown-item">Minimum Spanning Tree</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Stack
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/algorithms/stack/array" className="dropdown-item">Array Implementation</Link>
                  <Link to="/algorithms/stack/linked" className="dropdown-item">Linked List Implementation</Link>
                  <Link to="/algorithms/stack/applications" className="dropdown-item">Common Applications</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Queue
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/algorithms/queue/array" className="dropdown-item">Array Implementation</Link>
                  <Link to="/algorithms/queue/linked" className="dropdown-item">Linked List Implementation</Link>
                  <Link to="/algorithms/queue/priority" className="dropdown-item">Priority Queue</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Hashmap
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/algorithms/hashmap/chaining" className="dropdown-item">Chaining</Link>
                  <Link to="/algorithms/hashmap/open-addressing" className="dropdown-item">Open Addressing</Link>
                  <Link to="/algorithms/hashmap/double-hashing" className="dropdown-item">Double Hashing</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Tree
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/algorithms/tree/binary" className="dropdown-item">Binary Tree</Link>
                  <Link to="/algorithms/tree/bst" className="dropdown-item">Binary Search Tree</Link>
                  <Link to="/algorithms/tree/avl" className="dropdown-item">AVL Tree</Link>
                  <Link to="/algorithms/tree/red-black" className="dropdown-item">Red-Black Tree</Link>
                </div>
              </div>
              <div className="nested-dropdown">
                <div className="dropdown-item dropdown-item-with-arrow">
                  Heap
                  <FaChevronRight className="dropdown-arrow" />
                </div>
                <div className="nested-dropdown-menu">
                  <Link to="/algorithms/heap/binary" className="dropdown-item">Binary Heap</Link>
                  <Link to="/algorithms/heap/fibonacci" className="dropdown-item">Fibonacci Heap</Link>
                  <Link to="/algorithms/heap/applications" className="dropdown-item">Common Applications</Link>
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
