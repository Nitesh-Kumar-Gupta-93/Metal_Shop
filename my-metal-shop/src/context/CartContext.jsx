import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(undefined);
const FIXED_USER_ID = '3'; // Hardcoded user ID to ensure consistency

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart items from backend when component mounts
  useEffect(() => {
    // Force clear and set the correct userId
    localStorage.removeItem('userId');
    localStorage.setItem('userId', FIXED_USER_ID);
    console.log('🔑 CartContext: Set userId to', FIXED_USER_ID);
    
    // Fetch cart immediately
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      console.log(`🔍 CartContext: Fetching cart for user ${FIXED_USER_ID}`);
      const response = await fetch(`http://localhost:5000/api/cart/${FIXED_USER_ID}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      console.log(`✅ CartContext: Found ${data.length} cart items`);
      setCartItems(data);
    } catch (err) {
      console.error('❌ CartContext: Error fetching cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      console.log(`🛒 CartContext: Adding product ${productId} to cart for user ${FIXED_USER_ID}`);
      
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userId: parseInt(FIXED_USER_ID), 
          productId: parseInt(productId), 
          quantity 
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ CartContext: Failed to add item to cart: ${response.status}`, errorData);
        throw new Error(`Failed to add item to cart: ${response.statusText}`);
      }

      // Refresh cart items
      console.log('✅ CartContext: Item added, refreshing cart');
      await fetchCartItems();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      // Update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cartid === cartId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      // Update local state
      setCartItems(prevItems => prevItems.filter(item => item.cartid !== cartId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/cart/user/${FIXED_USER_ID}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCartItems([]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 