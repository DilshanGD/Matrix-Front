import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/StaffSidebar.css';
import config from '../../../config';

const StaffSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${config.apiUrl}/staff/logout`, {}, {
        withCredentials: true, // Include cookies in the request
      });
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="staff-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Staff Dashboard</h2>
      </div>

      <nav>
        <ul className="sidebar-links">
          <li>
            <Link to="/staff" className="sidebar-link">Dashboard</Link>
          </li>
          <li>
            <Link to="/staff/classes" className="sidebar-link">Classes</Link>
          </li>
          <li>
            <Link to="/staff/add-new" className="sidebar-link">Add New</Link>
          </li>
          <li>
            <Link to="/staff/StaffProfile" className="sidebar-link">My Profile</Link>
          </li>
          <li>
            <Link to="/staff/payments" className="sidebar-link">Payments</Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="sidebar-link logout-btn"
              aria-label="Logout"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default StaffSidebar;
