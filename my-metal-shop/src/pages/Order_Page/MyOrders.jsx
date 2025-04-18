import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get userId from localStorage (using our fixed user ID)
      const userId = localStorage.getItem('userId') || '3';
      
      const response = await fetch(`http://localhost:5000/api/orders/${userId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched orders:', data);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fallback to static data if API request fails or returns empty
  const loadStaticData = () => {
    return [
      {
        orderid: 1,
        createdat: new Date().toISOString(),
        total_amount: 299.99,
        shipping_address: '123 Main St, City, Country',
        payment_method: 'Cash on Delivery',
        order_status: 'Processing',
        items: [
          {
            productId: 2,
            productName: 'Metal Gate',
            quantity: 1,
            priceAtTime: 299.99,
            productImage: 'productImage-1744962680344-531700763.jpg'
          }
        ]
      }
    ];
  };

  if (loading) return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <p className="loading">Loading your orders...</p>
    </div>
  );

  // If error or no orders, use static data
  const displayOrders = orders.length > 0 ? orders : (error ? loadStaticData() : []);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUserOrders} className="retry-btn">Try Again</button>
        </div>
      )}
      
      {displayOrders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')} className="shop-now-btn">
            Shop Now
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {displayOrders.map((order) => (
            <div key={order.orderid} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.orderid}</h3>
                  <p className="order-date">Placed: {new Date(order.createdat).toLocaleDateString()}</p>
                </div>
                <span className={`order-status ${order.order_status.toLowerCase()}`}>
                  {order.order_status}
                </span>
              </div>
              
              <div className="order-items">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={`http://localhost:5000/uploads/${item.productImage}`} 
                      alt={item.productName}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.priceAtTime}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                <p><strong>Payment Method:</strong> {order.payment_method || 'Cash on Delivery'}</p>
                <p className="order-total"><strong>Total:</strong> ${order.total_amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
