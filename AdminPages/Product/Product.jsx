import React, { useEffect, useState } from "react";
import './product.css';
import { Link, useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setProducts(products.filter(product => product.productid !== productId));
        alert('Product deleted successfully!');
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert('Error deleting product');
      });
  };

  return (
    <div className="dashboard-container">
      <header>
        <div className="logo">Admin Dashboard</div>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/messages">Contact Messages</Link></li>
            <li><Link to="/admin/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Products</h1>
        <button
          className="add-product-button"
          onClick={() => navigate('/admin/addProduct')}
        >
          Add New Product
        </button>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.productid}>
                <td>{index + 1}</td>
                <td>{product.productname}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt="Product"
                    width="60"
                    height="60"
                  />
                </td>
                <td className="action-links">
                <Link to={`/admin/editProduct?productid=${product.productid}`}>Edit</Link>
                  <button 
                    onClick={() => handleDelete(product.productid)} 
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <p>&copy; 2025 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Product;
