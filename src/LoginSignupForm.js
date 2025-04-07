import React, { useState } from 'react';
import './LoginSignupForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignupForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      alert(res.data.message);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert('Passwords do not match!');
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert('Please enter your email.');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: forgotEmail,
      });
      alert(res.data.message);
      setShowForgot(false);
      setForgotEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container">
      <div className="tab-container">
        <button className={activeTab === 'login' ? 'tab active' : 'tab'} onClick={() => setActiveTab('login')}>Login</button>
        <button className={activeTab === 'signup' ? 'tab active' : 'tab'} onClick={() => setActiveTab('signup')}>Signup</button>
      </div>

      <div className="form-box">
        <h2>{activeTab === 'login' ? 'Login Form' : 'Signup Form'}</h2>

        <form onSubmit={activeTab === 'login' ? handleLogin : handleSignup}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {activeTab === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          {activeTab === 'login' && (
            <div className="forgot-password">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>Forgot password?</a>
            </div>
          )}

          <button type="submit">{activeTab === 'login' ? 'Login' : 'Signup'}</button>
        </form>

        <div className="bottom-text">
          {activeTab === 'login' ? (
            <>
              Not a member?{' '}
              <a href="#" onClick={() => setActiveTab('signup')}>Signup now</a>
            </>
          ) : (
            <>
              Already a member?{' '}
              <a href="#" onClick={() => setActiveTab('login')}>Login now</a>
            </>
          )}
        </div>

        {showForgot && (
          <div className="forgot-box">
            <h3>Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button type="submit">Send Reset Link</button>
              <button type="button" onClick={() => setShowForgot(false)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignupForm;
