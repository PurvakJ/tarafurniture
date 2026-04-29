import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when clicking a link
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          TARA FURNITURE HOUSE
        </Link>
        
        <button 
          className={`menu-toggle ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          <li><NavLink to="/" onClick={closeMenu} end>Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/products" onClick={closeMenu}>Products</NavLink></li>
          <li><NavLink to="/reviews" onClick={closeMenu}>Reviews</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
          <li><NavLink to="/admin" onClick={closeMenu}>Admin</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;