// frontend/src/pages/StudentRegistration.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/StudentRegistration.css';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const StudentRegistration = () => {
  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota',
    'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale',
    'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
  ];

  const [formData, setFormData] = useState({
    full_name: '', gender: '', phone: '', district: '', school: '', batch_id: '', stream_id: '', 
    email: '', pwd: '', confirmPassword: '', parentName: '', phoneParent: '', emailParent: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [batches, setBatches] = useState([]);
  const [streams, setStreams] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.apiUrl}/student/new-student-registration`)
      .then(response => {
        setBatches(response.data.batches || []);
        setStreams(response.data.streams || []);
      })
      .catch(error => console.error('Error loading batches and streams:', error));
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prevData => {
      // Update stream_id directly based on selected stream option
      if (name === 'stream_id') {
        return { ...prevData, stream_id: value };
      }
      return { ...prevData, [name]: value };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Password and Confirm Password Validation
    if (formData.pwd !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.emailParent && !emailRegex.test(formData.emailParent)) {
      newErrors.emailParent = 'Invalid parent/guardian email address';
    }

    // Phone Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number, must be 10 digits';
    }
    if (formData.phoneParent && !phoneRegex.test(formData.phoneParent)) {
      newErrors.phoneParent = 'Invalid parent/guardian phone number, must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    setSuccessMessage('');

    // Validate form data before making API request
    if (!validateForm()) return;

    try {
      await axios.post(`${config.apiUrl}/student/student-registration`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSuccessMessage('Registration successful! You can now log in.');
      setFormData({
        full_name: '', gender: '', phone: '', district: '', school: '', batch_id: '', stream_id: '',
        email: '', pwd: '', confirmPassword: '', parentName: '', phoneParent: '', emailParent: ''
      });
      navigate('/');
    } catch (error) {
      if (error.response?.data.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach(({ path, msg }) => { 
          validationErrors[path] = msg; 
        });
        setErrors(validationErrors);
      } else if (error.response?.data.error) {
        setApiError(error.response.data.error);
      } else {
        console.error('Error registering student:', error);
      }
    }
  };

  return (
    <div className="student-registration">
      <img src="/path/to/logo.png" alt="Matrix Logo" className="logo" />
      <h2>Student Registration Form</h2>
      <p>Fill Your Details Here.</p>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {apiError && <p className="error-message">{apiError}</p>}

      <form onSubmit={handleSubmit}>
        {[ 
          { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Full Name' },
          { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female'] },
          { label: 'Mobile No', name: 'phone', type: 'text', placeholder: 'Mobile No' },
          { label: 'District', name: 'district', type: 'select', options: districts },
          { label: 'School', name: 'school', type: 'text', placeholder: 'School' },
          { label: 'Batch', name: 'batch_id', type: 'select', options: batches.map(batch => batch.batch_id) },
          { label: 'Stream', name: 'stream_id', type: 'select', options: streams.map(stream => ({ id: stream.stream_id, title: stream.title })) },
          { label: 'Parent/Guardian Name', name: 'parentName', type: 'text', placeholder: 'Parent/Guardian Name' },
          { label: 'Parent/Guardian Tel', name: 'phoneParent', type: 'text', placeholder: 'Parent/Guardian Tel' },
          { label: 'Parent/Guardian Email', name: 'emailParent', type: 'email', placeholder: 'Parent/Guardian Email' },
          { label: 'Email', name: 'email', type: 'email', placeholder: 'Email' },
          { label: 'Password', name: 'pwd', type: 'password', placeholder: 'Password' },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
        ].map(({ label, name, type, placeholder, options }, idx) => (
          <div className="form-group" key={idx}>
            <label>{label}</label>
            {type === 'select' ? (
              <select name={name} value={formData[name]} onChange={handleChange}>
                <option value="">Select {label}</option>
                {options.map((option, i) => (
                  <option key={i} value={option.id || option}>{option.title || option}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            )}
            {errors[name] && <p className="error">{errors[name]}</p>}
          </div>
        ))}

        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default StudentRegistration;
