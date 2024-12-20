import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/StaffTopbar.css'; // Import the CSS file for styling
import config from '../../../config';

const StaffTopbar = () => {
  const [staffData, setStaffData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch staff topbar data from the API
    const fetchStaffData = async () => {
      try {
        const response = await axios.post(
          `${config.apiUrl}/staff/staff-topbar`,
          {},
          { withCredentials: true } // Include cookies in the request
        );
        setStaffData(response.data);
      } catch (err) {
        console.error('Error fetching staff data:', err);
        setError(err.response?.data?.message || 'Failed to load staff data');
      }
    };

    fetchStaffData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!staffData) {
    return <div className="loading-message">Loading staff information...</div>;
  }

  return (
    <div className="staff-topbar">
      {/* Left: Navigation Logo */}
      <div className="nav-logo">
        <img
          src={staffData.nav_logo ? `/${staffData.nav_logo}` : '/default-logo.png'}
          alt="Navigation Logo"
          className="nav-logo-img"
        />
      </div>

      {/* Middle: Staff Full Name and Username */}
      <div className="staff-info">
        <p className="staff-full-name">{staffData.full_name || 'Staff Name'}</p>
        <p className="staff-username">{staffData.username || 'Username'}</p>
      </div>

      {/* Right: Profile Picture */}
      <div className="profile-pic">
        <img
          src={ staffData.profile_pic }
          alt={`${staffData.full_name || 'Staff'}'s profile`}
          className="profile-pic-img"
        />
      </div>
    </div>
  );
};

export default StaffTopbar;
