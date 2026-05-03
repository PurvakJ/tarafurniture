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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [categories, setCategories] = useState([
    'living-room',
    'bedroom', 
    'dining',
    'office',
    'storage',
    'decor',
    'electronics'
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tempImagePreviews, setTempImagePreviews] = useState([]);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "dm9gg8yss";
  const CLOUDINARY_UPLOAD_PRESET = "images";

  // Admin credentials for Royal Furniture & Electronics
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
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  }, [activeTab]);

  // Check for existing auth on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('royalAdminAuth');
    const authTime = localStorage.getItem('royalAdminAuthTime');
    
    if (savedAuth === 'true' && authTime) {
      const now = new Date().getTime();
      const expiryTime = parseInt(authTime) + (24 * 60 * 60 * 1000);
      
      if (now < expiryTime) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('royalAdminAuth');
        localStorage.removeItem('royalAdminAuthTime');
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
      localStorage.setItem('royalAdminAuth', 'true');
      localStorage.setItem('royalAdminAuthTime', new Date().getTime().toString());
      setLoginData({ username: '', password: '' });
    } else {
      setLoginError('Invalid username or password');
      setLoginData({ ...loginData, password: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('royalAdminAuth');
    localStorage.removeItem('royalAdminAuthTime');
    localStorage.removeItem('royalAdminSession');
    
    setIsAuthenticated(false);
    setActiveTab('products');
    setProducts([]);
    setAppointments([]);
    setReviews([]);
    setShowModal(false);
    setEditingItem(null);
    
    window.location.reload();
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValidType) alert(`${file.name} is not an image file`);
      if (!isValidSize) alert(`${file.name} is too large (max 5MB)`);
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      setSelectedFiles([...selectedFiles, ...validFiles]);
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setTempImagePreviews([...tempImagePreviews, ...newPreviews]);
    }
  };

  const removeSelectedImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(tempImagePreviews[index]);
    
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = tempImagePreviews.filter((_, i) => i !== index);
    
    setSelectedFiles(newSelectedFiles);
    setTempImagePreviews(newPreviews);
  };

  const uploadAllImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    setUploadingImages(true);
    const uploadedUrls = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        setUploadProgress(prev => ({ ...prev, [i]: 'uploading' }));
        const url = await uploadImageToCloudinary(selectedFiles[i]);
        uploadedUrls.push(url);
        setUploadProgress(prev => ({ ...prev, [i]: 'completed' }));
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        setUploadProgress(prev => ({ ...prev, [i]: 'failed' }));
        alert(`Failed to upload image ${i + 1}. Please try again.`);
      }
    }
    
    setUploadingImages(false);
    return uploadedUrls;
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
      'decor': 'Decor',
      'electronics': 'Electronics'
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
      'decor': '🎨',
      'electronics': '📺'
    };
    return icons[category] || '🪑';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Upload new images to Cloudinary if any
    let allImages = [...formData.images];
    
    if (selectedFiles.length > 0) {
      const uploadedUrls = await uploadAllImages();
      allImages = [...allImages, ...uploadedUrls];
      
      if (uploadedUrls.length !== selectedFiles.length) {
        alert('Some images failed to upload. Please try again.');
        return;
      }
    }
    
    if (allImages.length === 0) {
      alert('Please add at least one product image');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      images: allImages
    };

    try {
      if (editingItem) {
        await updateProduct({ ...productData, id: editingItem.id });
        alert('Product updated successfully!');
      } else {
        await addProduct(productData);
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
    // Clean up preview URLs
    tempImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'living-room',
      featured: false,
      images: []
    });
    setSelectedFiles([]);
    setTempImagePreviews([]);
    setUploadProgress({});
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
    setSelectedFiles([]);
    setTempImagePreviews([]);
    setUploadProgress({});
    setShowModal(true);
  };

  const removeExistingImage = (indexToRemove) => {
    const newImages = formData.images.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, images: newImages });
  };

  if (isLoading) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="login-header">
            <div className="login-icon">👑</div>
            <h1>ROYAL FURNITURE & ELECTRONICS</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="login-header">
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

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <span className="admin-icon">👑</span>
            <h1>Admin Dashboard</h1>
            <span className="admin-badge">TARA FURNITURE HOUSE</span>
          </div>
          <div className="admin-contact-info">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
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
                  placeholder="e.g., Royal Premium Sofa"
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
                <label>Product Images *</label>
                
                {/* Existing Images Display for Edit Mode */}
                {editingItem && formData.images.length > 0 && (
                  <div className="existing-images-section">
                    <label>Current Images:</label>
                    <div className="image-grid">
                      {formData.images.map((imgUrl, index) => (
                        <div key={index} className="image-url-item">
                          <div className="image-preview-container">
                            <img 
                              src={imgUrl} 
                              alt={`Product ${index + 1}`} 
                              className="image-preview-thumb"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=Invalid+URL';
                              }}
                            />
                            <button 
                              type="button" 
                              className="remove-image-btn"
                              onClick={() => removeExistingImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Upload New Images Section */}
                <div className="image-upload-section">
                  <label>Upload New Images:</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelection}
                      className="file-input"
                      id="image-upload"
                      disabled={uploadingImages}
                    />
                    <label htmlFor="image-upload" className="file-input-label">
                      📁 Choose Images
                    </label>
                    <p className="helper-text">
                      Supported formats: JPG, PNG, GIF, WebP (Max 5MB each)
                    </p>
                  </div>
                  
                  {/* Image Preview for Upload */}
                  {tempImagePreviews.length > 0 && (
                    <div className="image-urls-list">
                      <label>Images to Upload ({tempImagePreviews.length}):</label>
                      <div className="image-grid">
                        {tempImagePreviews.map((preview, index) => (
                          <div key={index} className="image-url-item">
                            <div className="image-preview-container">
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`} 
                                className="image-preview-thumb"
                              />
                              <button 
                                type="button" 
                                className="remove-image-btn"
                                onClick={() => removeSelectedImage(index)}
                                disabled={uploadingImages}
                              >
                                ✕
                              </button>
                              {uploadProgress[index] === 'uploading' && (
                                <div className="upload-progress-overlay">
                                  <div className="spinner"></div>
                                </div>
                              )}
                              {uploadProgress[index] === 'completed' && (
                                <div className="upload-success-overlay">✓</div>
                              )}
                              {uploadProgress[index] === 'failed' && (
                                <div className="upload-failed-overlay">✗</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {uploadingImages && (
                  <div className="uploading-indicator">
                    <div className="spinner"></div>
                    <p>Uploading images to Cloudinary...</p>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  type="submit" 
                  className="btn-submit-product"
                  disabled={uploadingImages}
                >
                  {uploadingImages ? 'Uploading Images...' : (editingItem ? 'Update Product' : 'Add Product')}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel-modal" 
                  onClick={() => setShowModal(false)}
                  disabled={uploadingImages}
                >
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