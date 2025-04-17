import React from 'react';
import './orders.css';
import { Link } from 'react-router-dom';

const Orders = () => {
  // Static data for orders (simulating database response)
  const orders = [
    { orderId: 1, customerName: 'John Doe', product: 'Product A', quantity: 2, totalPrice: 20.00, status: 'Shipped' },
    { orderId: 2, customerName: 'Jane Smith', product: 'Product B', quantity: 1, totalPrice: 20.00, status: 'Pending' },
    // Add more orders as needed
  ];

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
        <h1>Orders</h1>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customerName}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <p>&copy; 2025 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Orders;
