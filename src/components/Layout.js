import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-header">SubTracker</div>
          <nav className="nav">
            <Link to="/dashboard" className={`nav-button ${isActive('/dashboard')}`}>
              📊 Dashboard
            </Link>
            <Link to="/analytics" className={`nav-button ${isActive('/analytics')}`}>
              📈 Analytics
            </Link>
            <Link to="/settings" className={`nav-button ${isActive('/settings')}`}>
              ⚙️ Settings
            </Link>
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ marginBottom: '10px', color: 'var(--text-secondary)' }}>
              👤 {user?.name}
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
              Logout
            </button>
          </div>
        </aside>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

