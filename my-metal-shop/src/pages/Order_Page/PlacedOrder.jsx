import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentDetails.css'; // Reusing same styling

const PlacedOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, totalPrice, address } = location.state || {};

  if (!product) {
    return (
      <div className="payment-container">
        <h2>⚠️ No order data found</h2>
        <p>There was an issue with your order information.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn green-btn"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h2>🎉 Order Placed Successfully</h2>
      <div className="order-details">
        <div className="product-info">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=No+Image";
            }}
          />
          <div className="product-details">
            <h3>{product.title}</h3>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
          </div>
        </div>
        
        <div className="order-info">
          <h3>Order Information</h3>
          <p><strong>Delivery Address:</strong> {address}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
          <p><strong>Order Status:</strong> Processing</p>
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>
        
        <div className="total-amount">
          <h3>Total Amount: ${totalPrice}</h3>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="btn green-btn"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PlacedOrder;
