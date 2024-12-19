import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AdminTopbar.css'; // Import the CSS file for styling
import config from '../../../config';

const AdminTopbar = () => {
  const [AdminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Admin topbar data from the API
    const fetchAdminData = async () => {
      try {
        const response = await axios.post(
          `${config.apiUrl}/admin/admin-topbar`,{ withCredentials: true } // Include cookies in the request
        );
        setAdminData(response.data);
      } catch (err) {
        console.error('Error fetching Admin data:', err.message);
        setError(err.response?.data?.message || 'Failed to load Admin data');
      }
    };

    fetchAdminData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!AdminData) {
    return <div className="loading-message">Loading Admin information...</div>;
  }

  return (
    <div className="Admin-topbar">
      {/* Left: Navigation Logo */}
      <div className="nav-logo">
        <img
          src={AdminData.nav_logo ? `/${AdminData.nav_logo}` : '/default-logo.png'}
          alt="Navigation Logo"
          className="nav-logo-img"
        />
      </div>

      {/* Middle: Admin Full Name and Username */}
      <div className="Admin-info">
        <p className="Admin-full-name">{AdminData.full_name || 'Admin Name'}</p>
        <p className="Admin-username">{AdminData.username || 'Username'}</p>
      </div>

      {/* Right: Profile Picture */}
      <div className="profile-pic">
        <img
          src={AdminData.profile_pic ? `/${AdminData.profile_pic}` : '/default-profile.png'}
          alt={`${AdminData.full_name || 'Admin'}'s profile`}
          className="profile-pic-img"
        />
      </div>
    </div>
  );
};

export default AdminTopbar;
