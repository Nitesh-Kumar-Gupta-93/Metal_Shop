import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData({
        name: user.name || user.username || '',
        email: user.email || '',
        password: user.password || ''
      });
    }
  }, []);

  const handleUpdateProfile = () => {
    navigate('/updateuserprofile');
  };

  const handleViewOrders = () => {
    navigate('/myOrders');
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
            <button type="button" onClick={handleUpdateProfile} className="profile-btn">
              Update Profile
            </button>
            <button type="button" onClick={handleViewOrders} className="profile-btn">
              My Orders
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
