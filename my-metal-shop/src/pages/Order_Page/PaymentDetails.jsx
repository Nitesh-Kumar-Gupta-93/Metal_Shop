import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity: initialQuantity, totalPrice: initialTotal, address: initialAddress } = location.state || {};
  
  // Add state for user inputs
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [address, setAddress] = useState(initialAddress || '');
  const [totalPrice, setTotalPrice] = useState(initialTotal || 0);

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

  // Update total when quantity changes
  const updateQuantity = (newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity below 1
    setQuantity(newQuantity);
    setTotalPrice((parseFloat(product.price) * newQuantity).toFixed(2));
  };

  const handleQRPayment = () => {
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }
    
    alert(`🧾 Paid $${totalPrice} via QR Code`);
    // Navigate to placed-order with all the order details
    navigate('/placed-order', {
      state: { product, quantity, totalPrice, address }
    });
  };

  const handleCashOnDelivery = () => {
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }
    
    alert(`📦 Order placed as COD for $${totalPrice}`);
    navigate('/placed-order', {
      state: { product, quantity, totalPrice, address }
    });
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      
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
            
            {/* Quantity adjustment */}
            <div className="quantity-control">
              <label htmlFor="quantity"><strong>Quantity:</strong></label>
              <div className="quantity-buttons">
                <button 
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >-</button>
                <input 
                  type="number"
                  id="quantity"
                  value={quantity} 
                  onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button 
                  onClick={() => updateQuantity(quantity + 1)}
                  className="quantity-btn"
                >+</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Address input */}
        <div className="address-section">
          <h3>Delivery Address</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full delivery address"
            className="address-input"
            required
          />
        </div>

        <div className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <div className="payment-method qr-method">
              <h4>Scan & Pay</h4>
              <img
                src="https://chart.googleapis.com/chart?cht=qr&chl=UPI://pay?pa=example@upi&pn=Metal%20Shop&am=${totalPrice}&cu=INR&tn=Order%20Payment&chs=250x250"
                alt="QR Code for payment"
                className="qr-code"
              />
              <p className="upi-id">UPI ID: metalshop@ybl</p>
              <button className="pay-now-btn" onClick={handleQRPayment}>Payment Done</button>
            </div>
            
            <div className="payment-method">
              <img
                src="https://img.icons8.com/color/96/000000/cash-in-hand.png"
                alt="Cash on Delivery"
                className="payment-icon"
              />
              <button className="cod-btn" onClick={handleCashOnDelivery}>
                Cash on Delivery
              </button>
            </div>
          </div>
        </div>
        
        <div className="total-amount">
          <h3>Total Amount: ${totalPrice}</h3>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
