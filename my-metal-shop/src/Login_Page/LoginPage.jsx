import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [role, setRole] = useState('User'); // Role state
  const [email, setEmail] = useState(''); // Email state for input
  const [password, setPassword] = useState(''); // Password state for input
  const navigate = useNavigate(); // Initialize navigate function

  // Static admin credentials
  const staticAdminEmail = 'admin';
  const staticAdminPassword = '12345';

  const handleLogin = async (e) => {
    e.preventDefault();

    if (role === 'Admin') {
      // Check if admin credentials match the static credentials
      if (email === staticAdminEmail && password === staticAdminPassword) {
        alert('Admin login successful!');
        localStorage.setItem('user', JSON.stringify({ email, role: 'Admin' }));
        navigate('/admin'); // Redirect to AdminHome.jsx page
        return;
      } else {
        alert('Invalid Admin credentials. Please try again.');
        return;
      }
    }

    // For "User" role, proceed with login via the API
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unexpected response from server' }));
        alert(errorData.error || 'Login failed');
        return;
      }

      // Ensure response is JSON
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const data = await response.json();
        alert('Login successful!');
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user info in localStorage
        console.log('User data:', data);
        navigate('/'); // Redirect to homepage after successful login
      } else {
        const errorMessage = await response.text();
        alert(`Unexpected response from server: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong during login. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="form-title">Login</h2>

        <div className="form-group">
          <label htmlFor="role">Login as:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)} // Update role state
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">{role === 'Admin' ? 'Admin Username' : 'Email'}:</label>
          <input
            type="text" // Input type remains text for both Admin username and User email
            id="email"
            name="email"
            placeholder={role === 'Admin' ? 'Enter Admin Username' : 'Enter Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder={role === 'Admin' ? 'Enter Admin Password' : 'Enter Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-green">Login</button>

        <a href="/register">
          <button type="button" className="btn-green">I don't have an account</button>
        </a>

        <a href="/forgotPassword" className="forgot-link">Forgot Password?</a>
      </form>
    </div>
  );
};

export default LoginPage;
