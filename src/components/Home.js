// pages/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getReviews, addReview } from '../api';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  // Carousel images
  const carouselImages = [
    {
      url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Premium Living Room Sets",
      subtitle: "Elegant Comfort for Your Home"
    },
    {
      url: "https://www.greenply.com:5001/originalfile1768993285849-287.jpg",
      title: "Modern Dining Tables",
      subtitle: "Where Families Gather"
    },
    {
      url: "https://i5.walmartimages.com/seo/Homfa-King-Floating-Bed-with-Lights-LED-Platform-Bed-Frame-with-Under-Bed-Storage-PU-Leather-Adjustable-Tufted-Upholstered-Bed-White_32409c95-94f9-420e-b716-9630f25281d9.8f225689bab6fa357ad35035d6d7d4e3.jpeg",
      title: "Luxury Bedroom Furniture",
      subtitle: "Rest in Style & Comfort"
    },
    {
      url: "https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "TARA FURNITURE HOUSE",
      subtitle: "Crafting Dreams Since 2010"
    }
  ];

  // Gallery items data - Static display only
  const galleryItems = [
    {
      id: 2,
      image: "https://m.media-amazon.com/images/I/813Ido2u92L._AC_UF894,1000_QL80_.jpg",
      title: "SOFA SETS",
      description: "Luxury fabric & leather sofas | Custom designs available"
    },
    {
      id: 3,
      image: "https://allianceinternationalstore.com/wp-content/uploads/2023/01/Hf864b58482284b4883350aebca153e332.jpg",
      title: "DINING TABLES",
      description: "Solid wood & modern glass top | Seats 4 to 10 people"
    },
    {
      id: 4,
      image: "https://themapletree.in/cdn/shop/files/image_aeef02ca-c011-479a-ae27-b396185f868c_1.jpg?v=1692438362",
      title: "BEDROOM SETS",
      description: "Complete bedroom solutions with storage beds"
    },
    {
      id: 6,
      image: "https://img.staticmb.com/mbimages/interiorDesignerCMS/decorPartner/1603/projectImage/Kitchen-design-ideas-by-arch-designo-Interior-designer-mumbai.jpg.webp",
      title: "KITCHEN CABINETS",
      description: "Modular & traditional kitchen storage"
    }
  ];

  // Services data
  const servicesData = [
    { title: "CUSTOM FURNITURE", description: "Tailor-made designs for your unique space" },
    { title: "RESTORATION", description: "Revive your antique furniture pieces" },
    { title: "CUSTOMER SATISFACTION", description: "Customer satisfaction be the priority" },
    { title: "HOME STAGING", description: "Professional setup for your home" }
  ];

  // Features data
  const plywoodFeatures = [
    { icon: "🛋️", title: "Premium Materials", description: "Solid wood, high-grade ply & quality fabrics" },
    { icon: "✨", title: "Custom Designs", description: "Made-to-order furniture for your space" },
    { icon: "🔧", title: "Installation Service", description: "Professional door delivery & setup" },
    { icon: "🛡️", title: "5 Year Warranty", description: "Complete peace of mind on all products" }
  ];

  // Handcrafted features
  const handcraftedFeatures = [
    "PREMIUM QUALITY",
    "CUSTOM DESIGNS",
    "BEST PRICES",
    "EXPERT CRAFTSMEN",
    "FREE DELIVERY*",
    "5 YEAR WARRANTY"
  ];

  // Function to get top 3 reviews
  const getTopReviews = (allReviews) => {
    const featured = allReviews.filter(review => review.featured === true);
    const nonFeatured = allReviews.filter(review => review.featured !== true);
    featured.sort((a, b) => b.rating - a.rating);
    nonFeatured.sort((a, b) => b.rating - a.rating);
    const sortedReviews = [...featured, ...nonFeatured];
    return sortedReviews.slice(0, 3);
  };

  // Load products and reviews
  const loadData = useCallback(async () => {
    try {
      const products = await getProducts();
      // Get featured products (up to 4)
      const featured = products.filter(p => p.featured === true).slice(0, 3);
      setFeaturedProducts(featured);
      
      const allReviews = await getReviews();
      const topThreeReviews = getTopReviews(allReviews);
      setReviews(topThreeReviews);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewFormData.name || !reviewFormData.comment) {
      alert('Please fill in all fields');
      return;
    }
    
    setReviewSubmitting(true);
    try {
      await addReview(reviewFormData);
      setReviewSuccess(true);
      setReviewFormData({ name: '', rating: 5, comment: '' });
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewForm(false);
      }, 3000);
      loadData();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'living-room': '🛋️',
      'bedroom': '🛏️',
      'dining': '🍽️',
      'office': '💼',
      'storage': '📦',
      'decor': '🎨'
    };
    return icons[category] || '🪑';
  };

  const getCategoryName = (category) => {
    const names = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'dining': 'Dining',
      'office': 'Office',
      'storage': 'Storage',
      'decor': 'Decor'
    };
    return names[category] || category;
  };

  return (
    <div className="home">
      {/* Image Carousel Section */}
      <section className="carousel-section">
        <div className="carousel-container">
          <div 
            className="carousel-slide"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="carousel-item">
                <div className="carousel-image-wrapper">
                  <img src={image.url} alt={image.title} className="carousel-image" loading={index === 0 ? "eager" : "lazy"} />
                  <div className="carousel-overlay">
                    <div className="carousel-content">
                      <h2>{image.title}</h2>
                      <p>{image.subtitle}</p>
                      <Link to="/products" className="btn-primary">Explore Collection</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous slide">❮</button>
          <button className="carousel-btn next" onClick={nextSlide} aria-label="Next slide">❯</button>
          
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
<section className="featured-products">
  <div className="section-header">
    <h2>FEATURED COLLECTION</h2>
    <p>Discover our handcrafted premium furniture pieces</p>
  </div>
  <div className="products-grid">
    {featuredProducts.map(product => (
      <div key={product.id} className="product-card">
        <div className="product-image">
          {product.images && product.images[0] && (
            <img src={product.images[0]} alt={product.name} loading="lazy" />
          )}
        </div>
        <div className="product-info">
          <span className="product-category">
            {getCategoryIcon(product.category)} {getCategoryName(product.category)}
          </span>
          <h3 className="product-name">{product.name}</h3>
          
          {/* Make sure price is visible */}
          <div className="product-price">₹{product.price?.toLocaleString() || '0'}</div>
          
          {/* Make sure description is visible */}
          <p className="product-description">
            {product.description && product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description || 'No description available'}
          </p>
          
          <div className="product-features">
            <span>✓ Free Delivery</span>
            <span>✓ 5 Year Warranty</span>
          </div>
          <Link to={`/products`} className="btn-view-product">
            View Details →
          </Link>
        </div>
      </div>
    ))}
  </div>
  <div className="view-all-container">
    <Link to="/products" className="btn-view-all">
      View All Products →
    </Link>
  </div>
</section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats">
          <div className="stat">
            <span className="stat-number">5000+</span>
            <span className="stat-label">HAPPY CUSTOMERS</span>
          </div>
          <div className="stat">
            <span className="stat-number">1500+</span>
            <span className="stat-label">FURNITURE PIECES SOLD</span>
          </div>
          <div className="stat">
            <span className="stat-number">16+</span>
            <span className="stat-label">YEARS OF EXCELLENCE</span>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="image-gallery-section">
        <div className="gallery-container">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className="gallery-item"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="gallery-label">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="gallery-overlay-hover"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>OUR SERVICES</h2>
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Tara Section */}
      <section className="plywood-industry">
        <div className="industry-content">
          <h2>WHY CHOOSE TARA FURNITURE HOUSE?</h2>
          <div className="industry-features">
            {plywoodFeatures.map((feature, index) => (
              <div key={index} className="industry-feature">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Section */}
      <section className="dedicated">
        <div className="dedicated-content">
          <h2>TARA FURNITURE HOUSE - CRAFTING DREAMS SINCE 1995</h2>
          <p>With over 28 years of experience, Tara Furniture House provides end-to-end furniture solutions including custom designs, quality manufacturing, safe delivery, professional installation, and long-term warranty support.</p>
          <div className="features-list">
            <div className="feature-item">01. PREMIUM LIVING ROOMS - Sofas, Center Tables & TV Units</div>
            <div className="feature-item">02. ELEGANT DINING - 4 to 10 Seater Dining Tables</div>
            <div className="feature-item">03. LUXURY BEDROOMS - Beds, Wardrobes & Dressers</div>
            <div className="feature-item">04. MODULAR KITCHENS - Sleek & Functional Storage</div>
            <div className="feature-item">05. OFFICE FURNITURE - Desks, Chairs & Conference Tables</div>
            <div className="feature-item">06. CUSTOM FURNITURE - Made-to-order for Your Space</div>
          </div>
        </div>
        <div className="dedicated-image"></div>
      </section>

      {/* Reviews Section */}
      <section className="sustainable">
        <h2>CUSTOMER REVIEWS</h2>
        <p className="subtitle">What our customers say about Tara Furniture House</p>
        
        <div className="review-form-wrapper">
          {!showReviewForm ? (
            <button className="btn-write-review" onClick={() => setShowReviewForm(true)}>
              Write a Review
            </button>
          ) : (
            <div className="review-form-container">
              <h3>Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={reviewFormData.name}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= reviewFormData.rating ? 'active' : ''}`}
                        onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Review *"
                    value={reviewFormData.comment}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {reviewSuccess && (
          <div className="success-message">✓ Thank you for your review!</div>
        )}

        <div className="sustainable-grid">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="sustainable-card">
                <div className="review-header">
                  <h3>{review.name}</h3>
                  <div className="rating-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p>{review.comment}</p>
                {review.featured && (
                  <div className="featured-badge">⭐ Featured Review</div>
                )}
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
        
        <div className="view-all-reviews">
          <Link to="/reviews" className="btn-view-all">
            View All Reviews →
          </Link>
        </div>
      </section>

      {/* Handcrafted Section */}
      <section className="handcrafted">
        <div className="handcrafted-content">
          <h2>TARA FURNITURE HOUSE - PREMIUM FURNITURE, CUSTOM CRAFTED FOR YOU</h2>
          <div className="handcrafted-features">
            {handcraftedFeatures.map((feature, index) => (
              <span key={index}>{feature}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>TARA<br />FURNITURE HOUSE</h1>
          <p>TRANSFORM YOUR HOME WITH<br />TIMELESS ELEGANCE</p>
          <Link to="/products" className="btn-primary">SHOP NOW</Link>
          <div className="rating">
            <span className="stars"></span>
            <span className="rating-value">4.5</span>
            <span className="rating-label">Google Rating</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
