import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchData();
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  // Category breakdown chart data
  const categoryData = {
    labels: Object.keys(analytics.categoryBreakdown || {}),
    datasets: [
      {
        data: Object.values(analytics.categoryBreakdown || {}),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4',
          '#84cc16',
        ],
      },
    ],
  };

  // Spending over time (simplified - in production, you'd want historical data)
  const generateTimeSeriesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const labels = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    const baseSpend = analytics.totalMonthly || 0;
    const data = labels.map(() => baseSpend + (Math.random() * 50 - 25)); // Simulated variation

    return { labels, data };
  };

  const timeSeries = generateTimeSeriesData();
  const spendingData = {
    labels: timeSeries.labels,
    datasets: [
      {
        label: 'Monthly Spending',
        data: timeSeries.data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Top subscriptions bar chart
  const topSubsData = {
    labels: analytics.topSubscriptions?.map((sub) => sub.name) || [],
    datasets: [
      {
        label: 'Monthly Cost (₹)',
        data: analytics.topSubscriptions?.map((sub) => sub.cost) || [],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="card">
          <div className="card-title">Total Monthly Spend</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            ₹{analytics.totalMonthly?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Total Yearly Spend</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            ₹{analytics.totalYearly?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Active Subscriptions</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
            {analytics.totalSubscriptions || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '30px' }}>
        <div className="card">
          <div className="card-title">Spending by Category</div>
          {Object.keys(analytics.categoryBreakdown || {}).length > 0 ? (
            <div style={{ height: '300px' }}>
              <Doughnut data={categoryData} options={chartOptions} />
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No data available</p>
          )}
        </div>

        <div className="card">
          <div className="card-title">Spending Over Time</div>
          <div style={{ marginBottom: '15px' }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-select"
              style={{ maxWidth: '200px' }}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={spendingData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Top Subscriptions by Cost</div>
          {analytics.topSubscriptions?.length > 0 ? (
            <div style={{ height: '300px' }}>
              <Bar data={topSubsData} options={chartOptions} />
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No subscriptions yet</p>
          )}
        </div>

        <div className="card">
          <div className="card-title">Upcoming Renewals</div>
          {analytics.upcomingRenewals?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {analytics.upcomingRenewals.map((renewal, index) => (
                <li
                  key={index}
                  style={{
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{renewal.name}</strong>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {format(new Date(renewal.renewalDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                      ₹{renewal.cost}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No upcoming renewals</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

