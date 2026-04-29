import React, { useState, useEffect } from 'react';
import { getReviews, addReview } from '../api';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await addReview(formData);
      setSuccess(true);
      setFormData({ name: '', rating: 5, comment: '' });
      setShowForm(false);
      loadReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="reviews-page">
      <section className="reviews-hero">
        <div className="container">
          <h1>Customer Reviews</h1>
          <p>What our customers say about us</p>
        </div>
      </section>

      <section className="reviews-stats">
        <div className="container">
          <div className="stats-container">
            <div className="rating-summary">
              <div className="average-rating">{averageRating}</div>
              <div className="stars-display">
                {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              </div>
              <div className="total-reviews">Based on {reviews.length} reviews</div>
            </div>
            <button className="btn-write-review" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <section className="review-form-section">
          <div className="container">
            <div className="review-form-container">
              <h2>Share Your Experience</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Rating *</label>
                  <div className="rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`rating-star ${star <= formData.rating ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review *</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows="5"
                    required
                    placeholder="Tell us about your experience with our products and service..."
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {success && (
        <div className="success-message">
          ✓ Thank you for your review! It will appear after admin approval.
        </div>
      )}

      <section className="reviews-list-section">
        <div className="container">
          <h2>All Reviews</h2>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{review.name}</h3>
                      <div className="rating-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="review-comment">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reviews;