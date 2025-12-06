import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const SubscriptionDetection = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('detect'); // 'detect', 'review', 'import'

  const handleDetect = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/subscriptions/detect`, { email });
      if (response.data && response.data.detected) {
        setDetected(response.data.detected || []);
        setStep('review');
      } else {
        setError(response.data.message || 'No subscriptions detected');
      }
    } catch (error) {
      console.error('Detection error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to detect subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGmailConnect = async () => {
    setLoading(true);
    setError('');
    try {
      // For simulation mode, we just call the endpoint directly without OAuth popup
      // In a real app, we would open a popup for Google Login
      const response = await axios.post(`${API_URL}/subscriptions/scan-gmail`, {
        accessToken: 'simulation-token' // Mock token for simulation
      });

      if (response.data && response.data.detected) {
        setDetected(response.data.detected || []);
        setStep('review');
      } else {
        setError(response.data.message || 'No subscriptions detected from Gmail');
      }
    } catch (error) {
      console.error('Gmail scan error:', error);
      setError('Failed to scan Gmail. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (index) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const handleImport = async () => {
    if (selected.size === 0) {
      setError('Please select at least one subscription to import');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const subscriptionsToImport = Array.from(selected).map(index => detected[index]);
      const response = await axios.post(`${API_URL}/subscriptions/bulk-import`, {
        subscriptions: subscriptionsToImport,
      });

      if (response.data.imported > 0) {
        alert(`Successfully imported ${response.data.imported} subscription(s)!`);
        onSuccess();
        onClose();
      } else {
        setError('No subscriptions were imported');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to import subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = (index, field, value) => {
    const updated = [...detected];
    updated[index] = { ...updated[index], [field]: value };
    setDetected(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">Detect Subscriptions</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}

        {step === 'detect' && (
          <div>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              We'll scan for common subscriptions you might have. This feature can detect subscriptions from:
            </p>

            <div className="form-group mb-4">
              <label htmlFor="detect-email" className="form-label">Check specific email (optional):</label>
              <input
                type="email"
                id="detect-email"
                className="form-input"
                placeholder="Enter email address (e.g., rahul.sharma@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="text-muted">Leave blank to use your account email.</small>
            </div>

            <ul className="list-group mb-4" style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li>Common subscription services (Netflix, Spotify, etc.)</li>
              <li>Your account information</li>
              <li>Email patterns (future: Gmail API integration)</li>
            </ul>
            <button
              onClick={handleDetect}
              disabled={loading}
              className="btn btn-primary btn-lg btn-block"
              style={{ width: '100%', padding: '12px', fontSize: '1.1rem', marginBottom: '15px' }}
            >
              {loading ? 'Detecting...' : '🔍 Detect Subscriptions'}
            </button>

            <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
              <hr style={{ margin: '0' }} />
              <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-secondary)', padding: '0 10px', color: 'var(--text-secondary)' }}>OR</span>
            </div>

            <button
              onClick={handleGmailConnect}
              disabled={loading}
              className="btn btn-secondary btn-lg btn-block"
              style={{ width: '100%', padding: '12px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <span style={{ fontSize: '1.2rem' }}>📧</span> Connect Gmail
            </button>
          </div>
        )}

        {step === 'review' && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Review Detected Subscriptions</h3>
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
              Select the subscriptions you want to add. You can edit the details before importing.
            </p>

            {detected.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                No new subscriptions detected. You may already have all common subscriptions added.
              </p>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                {detected.map((sub, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '10px',
                      backgroundColor: selected.has(index) ? 'var(--bg-secondary)' : 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        checked={selected.has(index)}
                        onChange={() => handleToggleSelect(index)}
                        style={{ marginRight: '10px', width: '18px', height: '18px' }}
                      />
                      <strong style={{ fontSize: '1.1rem' }}>{sub.name}</strong>
                    </div>

                    {selected.has(index) && (
                      <div style={{ marginLeft: '28px', marginTop: '10px' }}>
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={sub.category}
                            onChange={(e) => handleUpdateSubscription(index, 'category', e.target.value)}
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
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                          <label className="form-label">Monthly Cost (₹)</label>
                          <input
                            type="number"
                            className="form-input"
                            value={sub.monthlyCost || ''}
                            onChange={(e) => handleUpdateSubscription(index, 'monthlyCost', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            placeholder="Enter monthly cost in INR"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Renewal Date</label>
                          <input
                            type="date"
                            className="form-input"
                            value={sub.renewalDate ? new Date(sub.renewalDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleUpdateSubscription(index, 'renewalDate', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep('detect')} className="btn btn-secondary">
                Back
              </button>
              <button
                onClick={handleImport}
                className="btn btn-primary"
                disabled={loading || selected.size === 0}
              >
                {loading ? 'Importing...' : `Import ${selected.size} Selected`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetection;

