import React from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentDetails.css'; // Reusing same styling

const PlacedOrder = () => {
  const location = useLocation();
  const { product, quantity, totalPrice, address } = location.state || {};

  if (!product) {
    return <div className="payment-container">No order data found.</div>;
  }

  return (
    <div className="payment-container">
      <h2>🎉 Order Placed Successfully</h2>
      <p><strong>Product:</strong> {product.title}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Delivery Address:</strong> {address}</p>
      <p><strong>Payment Method:</strong> Cash on Delivery</p>
      <div className="total-amount">
        <h3>Total Paid on Delivery: ₹{totalPrice}</h3>
      </div>
    </div>
  );
};

export default PlacedOrder;
