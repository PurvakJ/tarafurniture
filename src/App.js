import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import Admin from './components/Admin';
import BookAppointment from './components/BookAppointment';
import './App.css';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

// Loading Screen Component
function LoadingScreen({ onLoad }) {
  const [animationState, setAnimationState] = useState('initial');
  const [showText, setShowText] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);

  useEffect(() => {
    // Start logo animation - pulsing and rotating
    setAnimationState('pulsing-rotating');

    // After 2 seconds, start the transition
    const pulseTimer = setTimeout(() => {
      setAnimationState('centering');
    }, 2000);

    // Show letters one by one
    const showLetters = () => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < 7) {
          setCurrentLetterIndex(index);
          index++;
        } else {
          clearInterval(interval);
          setShowText(true);
        }
      }, 150); // Show a new letter every 150ms

      return () => clearInterval(interval);
    };

    // Start showing letters after 2.2 seconds
    const lettersTimer = setTimeout(showLetters, 2200);

    // After 3.5 seconds, show the tagline
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 3500);

    // After 4.5 seconds, complete loading
    const completeTimer = setTimeout(() => {
      setAnimationState('complete');
      if (onLoad) {
        setTimeout(onLoad, 500); // Wait for exit animation
      }
    }, 4500);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(lettersTimer);
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoad]);

  // Array of letters for the word TARA
  const letters = ['T', 'A', 'R', 'A'];

  return (
    <div className={`loader-container ${animationState === 'complete' ? 'fade-out' : ''}`}>
      {/* Background decoration */}
      <div className="loader-background">
        <span>FURNITURE HOUSE</span>
        <span>TARA FURNITURE</span>
        <span>TARA FURNITURE HOUSE</span>
      </div>
      
      {/* Floating furniture icons */}
      <div className="furniture-icon">🛏️</div>
      <div className="furniture-icon">🪑</div>
      <div className="furniture-icon">🛋️</div>
      <div className="furniture-icon">🗄️</div>
      <div className="furniture-icon">🪞</div>
      <div className="furniture-icon">💡</div>

      <div className="loader-content">
        {/* Logo with enhanced animations */}
        <div className={`logo-wrapper ${animationState}`}>
          <img 
            src="https://i.postimg.cc/ryYyJHWN/Gemini-Generated-Image-ufbvqsufbvqsufbv-removebg-preview.png" 
            alt="TARA FURNITURE HOUSE" 
            className="loader-logo"
          />
          <div className="logo-ring"></div>
          <div className="logo-ring-outer"></div>
        </div>
        
        {/* Text container with sequential letter reveal */}
        <div className={`text-container ${showText ? 'visible' : ''}`}>
          {letters.map((letter, index) => (
            <span 
              key={index} 
              className={`letter ${currentLetterIndex >= index ? 'revealed' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
          <span className={`letter ${currentLetterIndex >= 4 ? 'revealed' : ''}`} style={{ animationDelay: '0.4s' }}> </span>
          <span className={`letter ${currentLetterIndex >= 5 ? 'revealed' : ''}`} style={{ animationDelay: '0.5s' }}>FURNITURE</span>
          <span className={`letter ${currentLetterIndex >= 6 ? 'revealed' : ''}`} style={{ animationDelay: '0.6s' }}>HOUSE</span>
        </div>

        {/* Tagline with slide-up animation */}
        <div className={`tagline-container ${showTagline ? 'visible' : ''}`}>
          <span className="tagline">Premium Furniture</span>
        </div>

        {/* Loading bar with enhanced animation */}
        <div className={`loading-bar-container ${showTagline ? 'visible' : ''}`}>
          <div className="loading-bar">
            <div className="loading-bar-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout component that conditionally shows Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  
  return (
    <div className="App">
      {!isAdminPage && <Navbar />}
      <main className={`main-content ${isAdminPage ? 'admin-main' : ''}`}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onLoad={handleLoadingComplete} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/products" element={
          <Layout>
            <Products />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
        <Route path="/reviews" element={
          <Layout>
            <Reviews />
          </Layout>
        } />
        <Route path="/book-appointment" element={
          <Layout>
            <BookAppointment />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout>
            <Admin />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;