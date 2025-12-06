import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SubscriptionModal from '../components/SubscriptionModal';
import SubscriptionDetection from '../components/SubscriptionDetection';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetection, setShowDetection] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    fetchData();
    // Check if subscriptions were just imported (from URL params or localStorage)
    const imported = sessionStorage.getItem('subscriptionsImported');
    if (imported === 'true') {
      setImportMessage('Subscriptions have been automatically imported for your email!');
      sessionStorage.removeItem('subscriptionsImported');
      setTimeout(() => setImportMessage(''), 5000);
    }
  }, []);

  const fetchData = async () => {
    try {
      const [subsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/subscriptions`),
        axios.get(`${API_URL}/subscriptions/analytics/summary`),
      ]);
      setSubscriptions(subsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSubscription(null);
    setShowModal(true);
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await axios.delete(`${API_URL}/subscriptions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Failed to delete subscription');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSubscription(null);
    fetchData();
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {importMessage && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--success)',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid var(--success)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>✅ {importMessage}</span>
          <button onClick={() => setImportMessage('')} style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
      )}
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name}! 👋</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowDetection(true)} className="btn btn-secondary">
            🔍 Detect Subscriptions
          </button>
          <button onClick={handleAdd} className="btn btn-primary">
            + Add Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="card">
          <div className="card-title">Total Monthly Spend</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            ₹{analytics?.totalMonthly?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Total Yearly Spend</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            ₹{analytics?.totalYearly?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Active Subscriptions</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            {analytics?.totalSubscriptions || 0}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Upcoming Renewals</div>
        {analytics?.upcomingRenewals?.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {analytics.upcomingRenewals.slice(0, 5).map((renewal, index) => (
              <li
                key={index}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                }}
              >
                <strong>{renewal.name}</strong> - ₹{renewal.cost} on{' '}
                {format(new Date(renewal.renewalDate), 'MMM dd, yyyy')}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No upcoming renewals</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="card-title">My Subscriptions</h2>
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ maxWidth: '300px' }}
          />
        </div>

        {filteredSubscriptions.length > 0 ? (
          <div className="grid grid-2">
            {filteredSubscriptions.map((subscription) => (
              <div key={subscription._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{subscription.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Category: {subscription.category}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>
                      {subscription.currency === 'INR' ? '₹' : subscription.currency === 'USD' ? '$' : subscription.currency === 'EUR' ? '€' : '£'}{subscription.monthlyCost}/month
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Renews: {format(new Date(subscription.renewalDate), 'MMM dd, yyyy')}
                    </p>
                    {subscription.paymentMethod && (
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>
                        Payment: {subscription.paymentMethod}
                      </p>
                    )}
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        backgroundColor: subscription.autoRenewal ? 'var(--success)' : 'var(--warning)',
                        color: 'white',
                      }}
                    >
                      {subscription.autoRenewal ? 'Auto-renewal ON' : 'Auto-renewal OFF'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(subscription)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subscription._id)}
                      className="btn btn-danger"
                      style={{ padding: '8px 12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              {searchTerm ? 'No subscriptions found' : 'No subscriptions yet. Add your first subscription!'}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <SubscriptionModal
          subscription={editingSubscription}
          onClose={handleModalClose}
        />
      )}

      {showDetection && (
        <SubscriptionDetection
          onClose={() => setShowDetection(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default Dashboard;

