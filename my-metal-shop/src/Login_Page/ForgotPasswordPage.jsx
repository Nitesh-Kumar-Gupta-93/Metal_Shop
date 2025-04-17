import React, { useState } from 'react';
import './LoginPage.css'; // Reusing same styles

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    console.log({ email });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleReset}>
        <h2 className="form-title">Forgot Password</h2>

        <div className="form-group">
          <label htmlFor="email">Enter your email:</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-green">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
