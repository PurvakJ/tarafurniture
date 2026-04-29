import React, { useState } from 'react';
import { bookAppointment } from '../api';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookAppointment(formData);
      setSubmitted(true);
      setFormData({ 
        name: '', 
        phone: '', 
        email: '', 
        message: '',
        preferredDate: '',
        preferredTime: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Contact TARA FURNITURE HOUSE</h1>
          <p>Visit our showroom or book a consultation with our furniture experts</p>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Our Showroom</h3>
              <p>#45, Furniture Street,<br />Ashok Nagar, Bengaluru - 560001<br />Karnataka, India</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Call Us</h3>
              <p>+91 98765 43210<br />+91 80 1234 5678</p>
              <small>Mon-Sat, 10 AM - 8 PM</small>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email Us</h3>
              <p>info@tarafurniture.com<br/>sales@tarafurniture.com</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🕒</div>
              <h3>Showroom Hours</h3>
              <p>Monday - Saturday: 10:00 AM - 8:00 PM<br />Sunday: 11:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-container">
            <div className="form-info">
              <h2>Book a Furniture Consultation</h2>
              <p>Schedule a free consultation with our furniture experts. We'll help you find the perfect pieces for your space.</p>
              <div className="benefits-list">
                <h4>Why book with us:</h4>
                <ul>
                  <li>✓ Free interior design consultation</li>
                  <li>✓ Custom furniture measurements</li>
                  <li>✓ Exclusive showroom preview</li>
                  <li>✓ 10% discount on first purchase</li>
                  <li>✓ Free delivery & installation</li>
                </ul>
              </div>
            </div>

            <div className="form-wrapper">
              {submitted && (
                <div className="success-message">
                  ✓ Consultation booked successfully! We'll contact you within 24 hours.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    >
                      <option value="">Select time</option>
                      <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                      <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                      <option value="12:00-13:00">12:00 PM - 1:00 PM</option>
                      <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
                      <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
                      <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
                      <option value="17:00-18:00">5:00 PM - 6:00 PM</option>
                      <option value="18:00-19:00">6:00 PM - 7:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>What are you looking for?</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about the furniture you're interested in (sofa, dining table, bedroom set, office furniture, etc.)"
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Booking Consultation...' : 'Book Free Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2>Visit Our Showroom</h2>
          <div className="map-container">
            <iframe
              title="TARA FURNITURE HOUSE Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.915181812374!2d77.5945!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e1417e67a0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="map-directions">
            <a 
              href="https://maps.google.com/?q=TARA+FURNITURE+HOUSE+Bengaluru" 
              target="_blank" 
              rel="noopener noreferrer"
              className="directions-btn"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;