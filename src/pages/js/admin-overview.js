import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/admin-overview.css';
import { FiEye } from 'react-icons/fi';

import AdminProducts from './admin-products';
import AdminCustomers from './admin-customers';
import AdminFeedback from './admin-feedback';
import SalesDashboard from './statistics';
import Overview from './overview';
import Stores from './stores';
import Orders from './orders';

// Environment variable for backend URL (used if needed in this or child components)
const BASE_URL = process.env.REACT_APP_BASE_URL;

const menuItems = [
  'Overview',
  'Statistics',
  'Customers',
  'Products',
  'Feedback',
  'Orders',
  'Store',
];

const AdminOverview = () => {
  const initialTab = localStorage.getItem('redirectToOrders') === 'true' ? 'Orders' : 'Overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // Clear redirect flag after using it
  useEffect(() => {
    if (localStorage.getItem('redirectToOrders') === 'true') {
      localStorage.removeItem('redirectToOrders');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storeId');
    navigate('/');
  };

  const handlePreview = () => {
    const storeId = localStorage.getItem('storeId');
    if (storeId) {
      navigate(`/store/${storeId}/template`);
    } else {
      alert('Store ID not found!');
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">DUKAANIFY</h2>
        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <a
              key={item}
              href="#"
              className={`sidebar-link ${activeTab === item ? 'active' : ''}`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </a>
          ))}
          <button className="logout-btn-1" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="topbar">
          <button
            className="preview-btn"
            onClick={handlePreview}
            title="Preview Storefront"
          >
            <FiEye size={20} />
          </button>
        </div>

        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Statistics' && <SalesDashboard />}
        {activeTab === 'Customers' && <AdminCustomers />}
        {activeTab === 'Products' && <AdminProducts />}
        {activeTab === 'Orders' && <Orders />}
        {activeTab === 'Feedback' && <AdminFeedback />}
        {activeTab === 'Store' && <Stores />}
      </main>
    </div>
  );
};

export default AdminOverview;
