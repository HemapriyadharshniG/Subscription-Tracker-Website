import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const SubscriptionModal = ({ subscription, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Entertainment',
    monthlyCost: '',
    renewalDate: '',
    paymentMethod: '',
    autoRenewal: true,
    currency: 'INR',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || '',
        category: subscription.category || 'Entertainment',
        monthlyCost: subscription.monthlyCost || '',
        renewalDate: subscription.renewalDate ? subscription.renewalDate.split('T')[0] : '',
        paymentMethod: subscription.paymentMethod || '',
        autoRenewal: subscription.autoRenewal !== undefined ? subscription.autoRenewal : true,
        currency: subscription.currency || 'INR',
      });
    }
  }, [subscription]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        monthlyCost: parseFloat(formData.monthlyCost),
      };

      if (subscription) {
        await axios.put(`${API_URL}/subscriptions/${subscription._id}`, data);
      } else {
        await axios.post(`${API_URL}/subscriptions`, data);
      }

      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {subscription ? 'Edit Subscription' : 'Add Subscription'}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Entertainment">Entertainment</option>
              <option value="Productivity">Productivity</option>
              <option value="Utilities">Utilities</option>
              <option value="Education">Education</option>
              <option value="Fitness">Fitness</option>
              <option value="Music">Music</option>
              <option value="News">News</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Cost</label>
            <input
              type="number"
              name="monthlyCost"
              className="form-input"
              value={formData.monthlyCost}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Renewal Date</label>
            <input
              type="date"
              name="renewalDate"
              className="form-input"
              value={formData.renewalDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method (Optional)</label>
            <input
              type="text"
              name="paymentMethod"
              className="form-input"
              value={formData.paymentMethod}
              onChange={handleChange}
              placeholder="e.g., Credit Card, PayPal"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select
              name="currency"
              className="form-select"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="autoRenewal"
                checked={formData.autoRenewal}
                onChange={handleChange}
              />
              Auto-renewal
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;

