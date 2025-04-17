import React, { useState, useEffect } from 'react';
import './UpdateUserProfile.css';

const UpdateUserProfile = () => {
  const [formData, setFormData] = useState({
    id: '', // include id for backend update
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      console.log('Loaded user:', user);
      setFormData((prev) => ({
        ...prev,
        id: user.id || '', // <-- Ensure this is set!
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        confirmPassword: user.password || ''
      }));
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error updating profile: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const updatedUser = await response.json();

      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <h2>Update Profile</h2>
        <form onSubmit={handleUpdate} className="update-profile-form">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit" className="update-btn">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserProfile;
