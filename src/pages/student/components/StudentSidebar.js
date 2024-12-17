// frontend/src/pages/student/components/StudentSidebar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/StudentSidebar.css';
import config from '../../../config';

const StudentSidebar = () => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await axios.post(`${config.apiUrl}/student/logout`, {}, {
        withCredentials: true,                       // Ensures cookies are included in the request
      });

      navigate('/');                                 // Redirect to the login page or home after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Student Dashboard</h2>
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/student" className="sidebar-link">Dashboard</Link>
        </li>
        <li>
          <Link to="/subjects" className="sidebar-link">Subjects</Link>
        </li>
        <li>
          <Link to="/timetable" className="sidebar-link">Timetable</Link>
        </li>
        <li>
          <Link to="/courses" className="sidebar-link">My Courses</Link>
        </li>
        <li>
          <Link to="/student/StudentProfile" className="sidebar-link">My Profile</Link>
        </li>
        <li>
          <Link to="/payments" className="sidebar-link">Payments</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="sidebar-link logout-btn">Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
