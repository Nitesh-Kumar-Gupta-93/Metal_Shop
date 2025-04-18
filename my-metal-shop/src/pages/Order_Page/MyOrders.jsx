import React, { useEffect, useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading with static data
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          product_name: 'Metal Table',
          product_image: 'https://5.imimg.com/data5/XD/PD/TG/SELLER-6796416/metal-furniture-1000x1000.jpg',
          category: 'Metal/Iron',
          quantity: 2,
          total_price: 3400,
          address: '123 Main St, Mumbai',
          status: 'Delivered',
        },
        {
          id: 2,
          product_name: 'Steel Shed',
          product_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRZfHMsjilK9YQ1-g3cwWyNbyLVnq3WiVzHI6FyHwogAghGYLD',
          category: 'Sheds',
          quantity: 1,
          total_price: 8000,
          address: '45 Industrial Area, Pune',
          status: 'Shipped',
        },
        {
          id: 3,
          product_name: 'Iron Shutter',
          product_image: 'https://5.imimg.com/data5/DG/IA/LD/SELLER-100375194/roller-shutter-vector-1605735-jpg-250x250.jpg',
          category: 'Shutter',
          quantity: 1,
          total_price: 4600,
          address: '12 Market Lane, Delhi',
          status: 'Processing',
        },
      ]);
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  if (loading) return <p className="loading">Loading your orders...</p>;

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <img src={order.product_image} alt={order.product_name} />
              <div className="order-info">
                <h3>{order.product_name}</h3>
                <p>Category: {order.category}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total: ₹{order.total_price}</p>
                <p>Address: {order.address}</p>
                <p>Status: <strong>{order.status}</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
