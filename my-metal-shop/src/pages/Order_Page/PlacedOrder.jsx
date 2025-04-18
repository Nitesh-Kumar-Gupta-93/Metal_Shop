import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentDetails.css'; // Reusing same styling

const PlacedOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, totalPrice, address, paymentMethod = 'Cash on Delivery' } = location.state || {};
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && !orderPlaced) {
      createOrder();
    }
  }, [product]);

  const createOrder = async () => {
    try {
      // Get userId from localStorage
      let userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('No user ID found in localStorage, using default user ID 3');
        userId = '3'; // Default to a test user if not logged in
        localStorage.setItem('userId', userId); // Set in localStorage to avoid future issues
      }

      // Check what property is available for the product ID
      const productId = product.productid || product.id || product.productId;
      if (!productId) {
        console.error('Product object:', product);
        throw new Error('Invalid product data: Missing product ID');
      }

      const orderData = {
        userId: parseInt(userId),
        products: [{
          productId: productId,
          quantity: quantity,
          price: parseFloat(product.price)
        }],
        totalAmount: parseFloat(totalPrice),
        shippingAddress: address,
        paymentMethod: paymentMethod
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      setOrderId(result.orderId);
      setOrderPlaced(true);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message);
    }
  };

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

  if (error) {
    return (
      <div className="payment-container">
        <h2>⚠️ Order Error</h2>
        <p>{error}</p>
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
      {orderId && <p className="order-id">Order #{orderId}</p>}
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
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
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
