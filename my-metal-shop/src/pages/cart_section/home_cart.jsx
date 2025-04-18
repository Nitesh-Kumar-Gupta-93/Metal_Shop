import React, { useState, useEffect } from "react";
import ProductSection from "../Product-Section/product_section";
import "./user_cart.css";

function HomeCart() {
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set up localStorage with demo user when component mounts
    useEffect(() => {
        // Force clear and reset localStorage to ensure we use the correct ID
        localStorage.removeItem('userId');
        localStorage.setItem('userId', '3');  // Use the existing user with ID 3
        console.log('🔑 Set demo user ID in localStorage to 3');
        
        // Get userId from localStorage
        const storedUserId = localStorage.getItem('userId');
        console.log('👤 Using userId:', storedUserId);
        setUserId(storedUserId);
    }, []);

    // Fetch cart items whenever userId changes
    useEffect(() => {
        if (userId) {
            console.log('🔄 Triggering cart fetch for userId:', userId);
            fetchCartItems();
        }
    }, [userId]);

    const fetchCartItems = async () => {
        if (!userId) {
            console.log('❌ Cannot fetch cart: No userId available');
            return;
        }

        try {
            setLoading(true);
            console.log(`🔍 Fetching cart items for user ${userId}...`);
            
            const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log(`📊 Cart API response status: ${response.status}`);
            
            if (response.ok) {
                const cartData = await response.json();
                console.log(`✅ Cart data received:`, cartData);
                setCart(cartData);
            } else {
                const errorText = await response.text();
                console.error(`❌ Failed to fetch cart items: ${response.status}`, errorText);
                setError(`Failed to fetch cart: ${response.statusText}`);
            }
        } catch (error) {
            console.error('🚨 Error fetching cart items:', error);
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        // Always ensure we're using the correct user ID - force it here as well
        localStorage.removeItem('userId');
        localStorage.setItem('userId', '3');
        const currentUserId = '3'; // Hardcode for absolute certainty
        
        console.log(`🔐 VERIFIED userId for cart add: ${currentUserId}`);
        
        if (!currentUserId) {
            alert('Please log in to add items to your cart');
            return;
        }

        try {
            console.log(`🛒 Adding to cart: Product ${product.productid} for user ${currentUserId}`);
            
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    userId: parseInt(currentUserId),
                    productId: product.productid,
                    quantity: 1
                }),
                credentials: 'include'
            });

            if (response.ok) {
                console.log('✅ Product added to cart successfully');
                // Refresh cart after adding item
                fetchCartItems();
                // Show success message
                alert(`${product.productname} added to cart!`);
            } else {
                const errorText = await response.text();
                console.error(`❌ Failed to add item to cart: ${response.status}`, errorText);
                alert('Failed to add item to cart. Please try again.');
            }
        } catch (error) {
            console.error('🚨 Error adding to cart:', error);
            alert(`Error adding item: ${error.message}`);
        }
    };

    return (
        <div>
            <ProductSection onAddToCart={handleAddToCart} />
            
            {/* Cart Section */}
            <div className="cart-section">
                <h3>🛒 Your Cart {cart.length > 0 ? `(${cart.length} items)` : ''}</h3>
                
                {loading ? (
                    <p>Loading cart items...</p>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={fetchCartItems}>Try Again</button>
                    </div>
                ) : cart.length > 0 ? (
                    <ul className="cart-list">
                        {cart.map((item) => (
                            <li key={item.cartid} className="cart-item">
                                <img 
                                    src={`http://localhost:5000/uploads/${item.image}`} 
                                    alt={item.productname} 
                                    className="cart-img" 
                                    onError={(e) => {
                                        console.log(`❌ Image failed to load: ${item.image}`);
                                        e.target.src = 'https://via.placeholder.com/100';
                                    }}
                                />
                                <div className="cart-item-details">
                                    <h4>{item.productname}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>${item.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in cart</p>
                )}
            </div>
        </div>
    );
}

export default HomeCart;
