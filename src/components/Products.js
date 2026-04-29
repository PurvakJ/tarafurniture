import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([{ value: 'all', label: 'All Categories', icon: '🪑' }]);

  const getCategoryDisplayName = useCallback((categoryValue) => {
    const displayNames = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'dining': 'Dining',
      'office': 'Office',
      'storage': 'Storage',
      'decor': 'Decor',
      'sofa': 'Sofa',
      'chair': 'Chair',
      'table': 'Table',
      'bed': 'Bed',
      'wardrobe': 'Wardrobe'
    };
    return displayNames[categoryValue] || 
           categoryValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, []);

  const getCategoryIcon = useCallback((category) => {
    const icons = {
      'living-room': '🛋️',
      'bedroom': '🛏️',
      'dining': '🍽️',
      'office': '💼',
      'storage': '📦',
      'decor': '🎨',
      'sofa': '🛋️',
      'chair': '🪑',
      'table': '🪑',
      'bed': '🛏️',
      'wardrobe': '📦'
    };
    return icons[category] || '🪑';
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      console.log('Raw API response:', data);
      
      // Set all products
      const validProducts = data.filter(product => product && product.id);
      setProducts(validProducts);
      
      // Extract unique categories from products
      const uniqueCategories = [...new Set(validProducts.map(product => product.category))];
      
      // Create category objects with icons and labels
      const dynamicCategories = uniqueCategories.map(cat => ({
        value: cat,
        label: getCategoryDisplayName(cat),
        icon: getCategoryIcon(cat)
      }));
      
      // Add "All Categories" at the beginning
      setCategories([
        { value: 'all', label: 'All Categories', icon: '🪑' },
        ...dynamicCategories
      ]);
      
      console.log('Dynamic categories:', dynamicCategories);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [getCategoryDisplayName, getCategoryIcon]);

  const filterAndSortProducts = useCallback(() => {
    let filtered = products.filter(product => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order (by id)
        filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    setFilteredProducts(filtered);
  }, [products, category, searchTerm, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  const getCategoryName = useCallback((category) => {
    return getCategoryDisplayName(category);
  }, [getCategoryDisplayName]);

  // Add to cart function
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${product.name} added to cart!`);
  };

  // Book consultation function
  const handleBookConsultation = (product, e) => {
    e.stopPropagation();
    // You can redirect to appointment page or open a modal
    window.location.href = '/appointment';
  };

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="container">
          <h1>Our Furniture Collection</h1>
          <p>Discover handcrafted pieces that transform your space into a home</p>
        </div>
      </section>

      <div className="products-container">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          
          <div className="filter-group search-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading beautiful furniture...</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">🪑</div>
                <h3>No furniture found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  className="btn-reset"
                  onClick={() => {
                    setCategory('all');
                    setSearchTerm('');
                    setSortBy('default');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                    <div className="product-image-container">
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="product-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          <span>🪑</span>
                        </div>
                      )}
                      {product.featured && (
                        <div className="product-badge">Featured</div>
                      )}
                      {product.images && product.images.length > 1 && (
                        <div className="image-count-badge">
                          +{product.images.length - 1}
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="product-category">
                        {getCategoryIcon(product.category)} {getCategoryName(product.category)}
                      </span>
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-price">₹{product.price.toLocaleString()}</div>
                      <p className="product-description">
                        {product.description && product.description.length > 80 
                          ? `${product.description.substring(0, 80)}...` 
                          : product.description}
                      </p>
                      <div className="product-footer">
                        <button className="view-details-btn">View Details →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal for detailed view */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            
            <div className="product-detail-gallery">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="gallery-grid">
                  {selectedProduct.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${selectedProduct.name} ${idx + 1}`} />
                  ))}
                </div>
              ) : (
                <div className="gallery-placeholder">
                  <span>🪑</span>
                </div>
              )}
            </div>
            
            <div className="product-detail-info">
              <span className="product-category-tag">
                {getCategoryIcon(selectedProduct.category)} {getCategoryName(selectedProduct.category)}
              </span>
              <h2>{selectedProduct.name}</h2>
              <div className="price-tag">₹{selectedProduct.price.toLocaleString()}</div>
              <div className="delivery-info">
                <span>✓ Free Delivery</span>
                <span>✓ 5 Year Warranty</span>
                <span>✓ Installation Included</span>
              </div>
              <p className="full-description">{selectedProduct.description}</p>
              <div className="modal-actions">
                <button 
                  className="btn-primary" 
                  onClick={(e) => handleAddToCart(selectedProduct, e)}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={(e) => handleBookConsultation(selectedProduct, e)}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;