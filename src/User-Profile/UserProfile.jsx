import React, { useEffect, useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData({
        name: user.name || user.username || '',  // <- handles both keys
        email: user.email || '',
        password: user.password || ''
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-img-wrapper">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            className="profile-img"
          />
        </div>

        <form className="profile-form">
          <label>Name:</label>
          <input type="text" value={userData.name} readOnly />

          <label>Email:</label>
          <input type="email" value={userData.email} readOnly />

          <label>Password:</label>
          <input type="password" value={userData.password} readOnly />

          <div className="profile-buttons">
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
