import React, { useState } from 'react';
import { bookAppointment } from '../api';

function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <h2>Appointment Booked Successfully!</h2>
          <p>We will contact you shortly.</p>
          <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Book Another Appointment</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you're interested in..."
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Book Appointment</button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;