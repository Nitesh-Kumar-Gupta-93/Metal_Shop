import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id)); // Remove user from state
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="dashboard-container">
      <header>
        <div className="logo">Admin Dashboard</div>
        <nav>
          <ul>
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="/admin/products">Products</a></li>
            <li><a href="/admin/users">Users</a></li>
            <li><a href="/admin/orders">Orders</a></li>
            <li><a href="/admin/messages">Contact Messages</a></li>
            <li><a href="/admin/logout">Logout</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>All Registered Users</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
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

export default Users;
