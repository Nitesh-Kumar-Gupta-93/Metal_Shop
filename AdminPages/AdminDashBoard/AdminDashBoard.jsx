import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <header>
        <div className="logo">Admin Dashboard</div>
        <nav>
          <ul>
          <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/messages">Contact Messages</Link></li>
            <li><Link to="/admin/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Dashboard Overview</h1>
        <div className="stats">
          <div className="stat">Total Products<br />120</div>
          <div className="stat">Total Users<br />85</div>
          <div className="stat">Total Orders<br />45</div>
          <div className="stat">Total Messages<br />10</div>
        </div>

        <div className="activities">
          <h2>Recent Activities</h2>
          <p>No recent activity available.</p>
        </div>

        <div className="sales-chart">
          <h2>Sales Chart</h2>
          <p>Sales chart will be displayed here.</p>
        </div>

        <div className="orders-summary">
          <h2>Orders Status Summary</h2>
          <p>Summary of order statuses goes here.</p>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
