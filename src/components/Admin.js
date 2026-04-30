import React, { useState, useEffect, useCallback } from 'react';
import { 
  getProducts, addProduct, updateProduct, deleteProduct,
  getAppointments, updateAppointment, deleteAppointment,
  getReviews, updateReview, deleteReview
} from '../api';
import './Admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([
    'living-room',
    'bedroom', 
    'dining',
    'office',
    'storage',
    'decor'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'living-room',
    featured: false,
    images: []
  });
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Admin credentials (in production, move to backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Tara@2024'
  };

  // Define loadData with useCallback to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    try {
      if (activeTab === 'products') {
        const data = await getProducts();
        setProducts(data);
      } else if (activeTab === 'appointments') {
        const data = await getAppointments();
        setAppointments(data);
      } else if (activeTab === 'reviews') {
        const data = await getReviews();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // If unauthorized, logout
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  }, [activeTab]); // Only recreate when activeTab changes

  // Check for existing auth on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    
    // Check if auth exists and is not expired (optional: add 24 hour expiry)
    if (savedAuth === 'true' && authTime) {
      const now = new Date().getTime();
      const expiryTime = parseInt(authTime) + (24 * 60 * 60 * 1000); // 24 hours
      
      if (now < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Auth expired, clear it
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  // Load data when authenticated and tab changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated, loadData]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === ADMIN_CREDENTIALS.username && 
        loginData.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setLoginError('');
      // Store auth with timestamp
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', new Date().getTime().toString());
      // Reset login form
      setLoginData({ username: '', password: '' });
    } else {
      setLoginError('Invalid username or password');
      // Clear password field on error
      setLoginData({ ...loginData, password: '' });
    }
  };

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    // Clear any other stored data
    localStorage.removeItem('adminSession');
    
    // Reset all state
    setIsAuthenticated(false);
    setActiveTab('products');
    setProducts([]);
    setAppointments([]);
    setReviews([]);
    setShowModal(false);
    setEditingItem(null);
    
    // Force a hard reload to reset all component state
    window.location.reload();
  };

  const addNewCategory = () => {
    if (newCategory && newCategory.trim() && !categories.includes(newCategory.trim().toLowerCase().replace(/\s+/g, '-'))) {
      const categoryValue = newCategory.trim().toLowerCase().replace(/\s+/g, '-');
      setCategories([...categories, categoryValue]);
      setFormData({ ...formData, category: categoryValue });
      setNewCategory('');
      setShowCategoryInput(false);
    } else if (categories.includes(newCategory.trim().toLowerCase().replace(/\s+/g, '-'))) {
      alert('Category already exists!');
    }
  };

  const getCategoryDisplayName = (categoryValue) => {
    const displayNames = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'dining': 'Dining',
      'office': 'Office',
      'storage': 'Storage',
      'decor': 'Decor'
    };
    return displayNames[categoryValue] || categoryValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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

  const addImageUrl = () => {
    if (imageUrlInput && imageUrlInput.trim()) {
      if (imageUrlInput.startsWith('http://') || imageUrlInput.startsWith('https://')) {
        setFormData({ 
          ...formData, 
          images: [...formData.images, imageUrlInput.trim()] 
        });
        setImageUrlInput('');
      } else {
        alert('Please enter a valid image URL starting with http:// or https://');
      }
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert('Please add at least one product image URL');
      return;
    }

    try {
      if (editingItem) {
        await updateProduct({ ...formData, id: editingItem.id });
        alert('Product updated successfully!');
      } else {
        await addProduct(formData);
        alert('Product added successfully!');
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleDelete = async (item, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (type === 'product') {
          await deleteProduct({ id: item.id });
          alert('Product deleted successfully!');
          loadData();
        } else if (type === 'appointment') {
          await deleteAppointment({ id: item.id });
          alert('Appointment deleted successfully!');
          loadData();
        } else if (type === 'review') {
          await deleteReview({ id: item.id });
          alert('Review deleted successfully!');
          loadData();
        }
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  const handleStatusUpdate = async (appointment, status) => {
    try {
      await updateAppointment({ id: appointment.id, status });
      alert('Appointment status updated!');
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleFeaturedToggle = async (review) => {
    try {
      await updateReview({ id: review.id, featured: !review.featured });
      alert('Review featured status updated!');
      loadData();
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'living-room',
      featured: false,
      images: []
    });
    setImageUrlInput('');
    setEditingItem(null);
  };

  const openEditModal = (product) => {
    setEditingItem(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      featured: product.featured,
      images: product.images || []
    });
    setImageUrlInput('');
    setShowModal(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="login-header">
            <div className="login-icon">🛋️</div>
            <h1>TARA FURNITURE HOUSE</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="login-header">
            <div className="login-icon">🛋️</div>
            <h1>TARA FURNITURE HOUSE</h1>
            <p>Admin Dashboard Login</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Enter admin username"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter admin password"
                required
              />
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit" className="login-btn">Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // Show admin dashboard if authenticated
  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <span className="admin-icon">🛋️</span>
            <h1>Admin Dashboard</h1>
            <span className="admin-badge">TARA FURNITURE HOUSE</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} 
          onClick={() => setActiveTab('products')}
        >
          📦 Products ({products.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} 
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments ({appointments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-content">
          <div className="admin-actions">
            <button className="btn-add" onClick={() => {
              resetForm();
              setShowModal(true);
            }}>
              + Add New Product
            </button>
          </div>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Images</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="image-cell">
                      <div className="mini-gallery">
                        {product.images && product.images.slice(0, 2).map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            alt={`${product.name} ${idx + 1}`} 
                            className="mini-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                            }}
                          />
                        ))}
                        {product.images && product.images.length > 2 && (
                          <span className="more-indicator">+{product.images.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td className="price-cell">₹{product.price.toLocaleString()}</td>
                    <td>
                      <span className="category-badge">
                        {getCategoryIcon(product.category)} {getCategoryDisplayName(product.category)}
                      </span>
                    </td>
                    <td>
                      <span className={`featured-badge ${product.featured ? 'yes' : 'no'}`}>
                        {product.featured ? '★ Featured' : '☆ Not Featured'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => openEditModal(product)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(product, 'product')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="admin-content">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Preferred Date</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    <td>{appointment.name}</td>
                    <td>{appointment.phone}</td>
                    <td>{appointment.email || '-'}</td>
                    <td>{appointment.preferredDate ? new Date(appointment.preferredDate).toLocaleDateString() : '-'}</td>
                    <td className="message-cell">{appointment.message || '-'}</td>
                    <td>
                      <select 
                        value={appointment.status} 
                        onChange={(e) => handleStatusUpdate(appointment, e.target.value)}
                        className={`status-select ${appointment.status}`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✓ Confirmed</option>
                        <option value="completed">✅ Completed</option>
                        <option value="cancelled">✗ Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDelete(appointment, 'appointment')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="admin-content">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id}>
                    <td>{new Date(review.date).toLocaleDateString()}</td>
                    <td>{review.name}</td>
                    <td>
                      <div className="rating-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </td>
                    <td className="comment-cell">{review.comment}</td>
                    <td>
                      <button 
                        className={`featured-btn ${review.featured ? 'active' : ''}`}
                        onClick={() => handleFeaturedToggle(review)}
                      >
                        {review.featured ? '★ Featured' : '☆ Feature'}
                      </button>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDelete(review, 'review')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Premium Leather Sofa"
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Detailed description of the product..."
                  rows="4"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="e.g., 29999"
                    step="1"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <div className="category-select-wrapper">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {getCategoryIcon(cat)} {getCategoryDisplayName(cat)}
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      className="btn-add-category"
                      onClick={() => setShowCategoryInput(!showCategoryInput)}
                    >
                      + New Category
                    </button>
                  </div>
                  
                  {showCategoryInput && (
                    <div className="new-category-input">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category name (e.g., Outdoor)"
                        className="category-input"
                      />
                      <button type="button" onClick={addNewCategory} className="btn-confirm-category">
                        Add
                      </button>
                      <button type="button" onClick={() => setShowCategoryInput(false)} className="btn-cancel-category">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  ⭐ Feature this product on homepage
                </label>
              </div>
              
              <div className="form-group">
                <label>Product Images (URLs) *</label>
                <div className="image-url-input-section">
                  <div className="url-input-group">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="url-input"
                    />
                    <button type="button" onClick={addImageUrl} className="btn-add-url">
                      + Add Image
                    </button>
                  </div>
                  <p className="helper-text">
                    💡 Tip: Use image URLs from reliable image hosting services
                  </p>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="image-urls-list">
                    <label>Added Images ({formData.images.length}):</label>
                    <div className="image-grid">
                      {formData.images.map((imgUrl, index) => (
                        <div key={index} className="image-url-item">
                          <div className="image-preview-container">
                            <img 
                              src={imgUrl} 
                              alt={`Preview ${index + 1}`} 
                              className="image-preview-thumb"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=Invalid+URL';
                              }}
                            />
                            <button 
                              type="button" 
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                          <div className="image-url-text">
                            <span className="url-label">URL {index + 1}:</span>
                            <input 
                              type="text" 
                              value={imgUrl} 
                              readOnly 
                              className="url-readonly"
                              onClick={(e) => e.target.select()}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-submit-product">
                  {editingItem ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" className="btn-cancel-modal" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;