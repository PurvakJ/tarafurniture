import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About TARA FURNITURE HOUSE</h1>
          <p>Crafting Elegant Furniture Since 1995</p>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>TARA FURNITURE HOUSE was founded in 2010 with a simple yet powerful vision: to bring beautifully crafted, high-quality furniture to homes and businesses across India. What began as a small workshop in the heart of the city has grown into a trusted destination for customers seeking timeless designs, superior craftsmanship, and exceptional value.</p>
            <p>For over years, we have been dedicated to creating furniture that combines traditional artistry with modern functionality. Every piece that leaves our workshop is a testament to our commitment to quality, durability, and aesthetic excellence.</p>
            <p>Today, TARA FURNITURE HOUSE stands as a symbol of trust, serving thousands of happy customers who have made us their preferred choice for home and office furniture.</p>
          </div>
          <div className="story-image"></div>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <h2>Our Mission & Vision</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To craft exceptional furniture that transforms spaces into beautiful, functional environments, delivered with outstanding service and unwavering commitment to quality.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To be India's most trusted furniture brand, recognized for exquisite craftsmanship, innovative designs, and complete customer satisfaction.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💎</div>
              <h3>Our Values</h3>
              <p>Craftsmanship First • Customer Centric • Innovation • Integrity • Excellence in Every Detail</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-features">
        <div className="container">
          <h2>Why Choose TARA FURNITURE HOUSE?</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">🪵</div>
              <h3>Premium Materials</h3>
              <p>Only the finest solid wood, premium ply, and high-quality fabrics used in every piece.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>Free door-step delivery on orders above ₹15,000 within city limits.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🔧</div>
              <h3>Professional Installation</h3>
              <p>Expert installation and assembly services for all furniture purchases.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🛡️</div>
              <h3>5 Year Warranty</h3>
              <p>Comprehensive warranty on all furniture products for peace of mind.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">✏️</div>
              <h3>Custom Designs</h3>
              <p>Tailor-made furniture solutions to fit your specific space and style.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">👥</div>
              <h3>Expert Consultation</h3>
              <p>Professional design consultation to help you create your dream space.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">16+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1500+</div>
              <div className="stat-label">Furniture Pieces Sold</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Custom Designs</div>
            </div>
          </div>
        </div>
      </section>


      <section className="about-cta">
        <div className="container">
          <h2>Ready to Transform Your Home?</h2>
          <p>Explore our exquisite collection of handcrafted furniture</p>
          <Link to="/products" className="btn-primary">Explore Collection</Link>
        </div>
      </section>
    </div>
  );
}

export default About;