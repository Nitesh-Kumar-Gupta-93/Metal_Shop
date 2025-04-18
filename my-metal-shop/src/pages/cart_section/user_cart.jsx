import React, { useState, useEffect } from 'react';
import './user_cart.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome for icons

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const FIXED_USER_ID = '3'; // Hardcoded user ID to ensure consistency

  useEffect(() => {
    // Force set the correct user ID
    localStorage.removeItem('userId');
    localStorage.setItem('userId', FIXED_USER_ID);
    console.log('🔑 UserCart: Set user ID to', FIXED_USER_ID);
    
    // Fetch cart immediately
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔍 UserCart: Fetching cart items for user ${FIXED_USER_ID}...`);
      
      const response = await fetch(`http://localhost:5000/api/cart/${FIXED_USER_ID}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`📊 UserCart: Cart API response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ UserCart: Cart data received (${data.length} items):`, data);
        setCartItems(data);
      } else {
        const errorText = await response.text();
        console.error(`❌ UserCart: Failed to fetch cart items: ${response.status}`, errorText);
        setError(`Failed to fetch cart: ${response.statusText}`);
      }
    } catch (error) {
      console.error('🚨 UserCart: Error fetching cart:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartId) => {
    try {
      console.log(`🗑️ UserCart: Removing item from cart: cartId=${cartId}`);
      
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`📊 UserCart: Remove item response status: ${response.status}`);
      
      if (response.ok) {
        console.log('✅ UserCart: Item removed successfully');
        // Refresh cart after removing item
        fetchCartItems();
      } else {
        const errorText = await response.text();
        console.error(`❌ UserCart: Failed to remove item: ${response.status}`, errorText);
        alert('Failed to remove item. Please try again.');
      }
    } catch (error) {
      console.error('🚨 UserCart: Error removing item:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <i className="fas fa-shopping-cart"></i> 
        {loading ? 'Loading Cart...' : `Items in Cart (${cartItems.length})`}
      </div>

      <div className="cart-items">
        {loading ? (
          <p className="loading">Loading cart items...</p>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchCartItems}>
              <i className="fas fa-sync"></i> Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart-container">
            <p className="empty-cart">Your cart is empty.</p>
            <p>Add some products to your cart!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.cartid} className="cart-item-card">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.productname}
                className="cart-item-image"
                onError={(e) => {
                  console.log(`❌ Image failed to load: ${item.image}`);
                  e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
              <div className="cart-item-details">
                <h4>{item.productname}</h4>
                <p className="cart-item-price">${item.price}</p>
                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                <button 
                  className="remove-item-btn"
                  onClick={() => handleRemoveFromCart(item.cartid)}
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {!loading && !error && cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total:</strong> $
            {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
          </div>
          <button className="checkout-btn">
            <i className="fas fa-shopping-cart"></i> Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCart;
