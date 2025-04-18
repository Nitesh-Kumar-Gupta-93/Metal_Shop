import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Order_Page.css';

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get cart items from localStorage
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get user ID from localStorage or your auth state management
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Please login to place an order');
      }

      const orderData = {
        userId: parseInt(userId),
        products: cartItems.map(item => ({
          productId: item.productid,
          quantity: item.quantity,
          price: parseFloat(item.price)
        })),
        totalAmount: parseFloat(calculateTotal()),
        shippingAddress
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      
      // Clear cart after successful order
      localStorage.setItem('cartItems', '[]');
      await clearCart(); // Clear cart in backend
      
      // Redirect to order confirmation page
      navigate('/placed-order', { 
        state: { 
          orderId: result.orderId,
          totalAmount: orderData.totalAmount 
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="order-page">
        <h2>Your Cart is Empty</h2>
        <button onClick={() => navigate('/products')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Order Summary</h2>
      
      <div className="order-items">
        {cartItems.map((item) => (
          <div key={item.productid} className="order-item">
            <img 
              src={`http://localhost:5000/uploads/${item.image}`} 
              alt={item.productname} 
            />
            <div className="item-details">
              <h3>{item.productname}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-total">
        <h3>Total Amount: ${calculateTotal()}</h3>
      </div>

      <form onSubmit={handleSubmitOrder} className="shipping-form">
        <h3>Shipping Information</h3>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
          required
        />
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading} className="place-order-btn">
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
