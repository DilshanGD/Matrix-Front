// frontend/src/pages/student/StudentSignIn.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/StudentSignIn.css';
import config from '../../config';

const StudentSignIn = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]); // Store multiple errors
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage(null);

    try {
      const response = await axios.post(`${config.apiUrl}/student/student-login`,
        {
          email,
          pwd: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.token) {
        setSuccessMessage("Login Successful!");
        setEmail('');
        setPassword('');
        // Navigate to Student.js after a successful login
        navigate('/student');
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        // Handle validation errors sent by the API
        setErrors(err.response.data.errors.map(error => error.msg));
      } else {
        // Handle other errors
        setErrors([err.response?.data || 'Login failed. Please try again.']);
      }
    }
  };

  return (
    <div className="signin-popup-overlay">
      <div className="signin-popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="signin-title">Student Login</h2>
        <form onSubmit={handleLogin} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
          {errors.length > 0 && (
            <div className="error-message">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default StudentSignIn;
