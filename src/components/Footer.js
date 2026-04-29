import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>TARA FURNITURE HOUSE</h3>
          <p>Creating timeless furniture pieces that transform houses into homes since 1995.</p>
          <div className="social-links">
            <a href="https://facebook.com/tarafurniture" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span>📘</span> Facebook
            </a>
            <a href="https://instagram.com/tarafurniture" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span>📸</span> Instagram
            </a>
            <a href="https://pinterest.com/tarafurniture" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <span>📌</span> Pinterest
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <span>💬</span> WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Our Collection</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/reviews">Customer Reviews</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Furniture Categories</h3>
          <ul>
            <li><Link to="/products?category=living-room">Living Room</Link></li>
            <li><Link to="/products?category=bedroom">Bedroom</Link></li>
            <li><Link to="/products?category=dining">Dining Room</Link></li>
            <li><Link to="/products?category=office">Office Furniture</Link></li>
            <li><Link to="/products?category=storage">Storage Solutions</Link></li>
            <li><Link to="/products">View All</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Visit Our Showroom</h3>
          <ul className="contact-info">
            <li>
              <span className="contact-icon">📍</span>
              <span>#45, Furniture Street, Ashok Nagar,<br />Bengaluru - 560001, Karnataka, India</span>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <span>+91 98765 43210 | +91 80 1234 5678</span>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <span>info@tarafurniture.com</span>
            </li>
            <li>
              <span className="contact-icon">🕒</span>
              <span>Mon-Sat: 10:00 AM - 8:00 PM<br />Sunday: 11:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} TARA FURNITURE HOUSE. All rights reserved.</p>
          <p className="footer-tagline">Crafting Dreams, Building Trust Since 1995</p>
        </div>
        <div className="footer-payment">
          <span>Secure Payments:</span>
          <span>💳</span>
          <span>🔒</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;