import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/AdminSidebar.css';
import config from '../../../config';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${config.apiUrl}/admin/logout`, {}, {
        withCredentials: true, // Include cookies in the request
      });
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">admin Dashboard</h2>
      </div>

      <nav>
        <ul className="sidebar-links">
          <li>
            <Link to="/admin" className="sidebar-link">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/teachers" className="sidebar-link">Teachers</Link>
          </li>
          <li>
            <Link to="/admin/streams" className="sidebar-link">Streams</Link>
          </li>
          <li>
            <Link to="/admin/subjects" className="sidebar-link">Subjects</Link>
          </li>
          <li>
            <Link to="/admin/batches" className="sidebar-link">Batches</Link>
          </li>
          <li>
            <Link to="/admin/add-new" className="sidebar-link">Add New</Link>
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

export default AdminSidebar;
