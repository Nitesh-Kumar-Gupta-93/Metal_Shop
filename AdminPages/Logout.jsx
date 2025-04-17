import React from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {
  return (
    <div className="app-container">
      <header>
        <div className="logo">Admin Dashboard</div>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/messages">Contact Messages</Link></li>
            <li><Link to="/login">Logout</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>Logged Out</h1>
        <p>You have successfully logged out.</p>
      </main>
      <footer>
        <p>&copy; 2025 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Logout;
