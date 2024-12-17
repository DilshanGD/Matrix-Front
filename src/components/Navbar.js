// frontend/src/components/Navbar.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StudentSignIn from '../pages/student/StudentSignIn';
import StaffSignIn from '../pages/staff/StaffSignIn';
import AdminSignIn from '../pages/admin/AdminSignIn';
import './css/Navbar.css';
import config from '../config';

const Navbar = () => {
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePopup, setActivePopup] = useState(''); // Tracks the active popup

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/navbar`)
      .then((response) => {
        const logoDetail = response.data.find((detail) => detail.detail_id === 'logo_nav');
        if (logoDetail) {
          setLogo(logoDetail.file_path);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching navbar details:', error);
        setError(true);
      });
  }, []);

  // Function to toggle the dropdown visibility
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to handle popup toggle
  const handlePopupToggle = (popup) => {
    setActivePopup((current) => (current === popup ? '' : popup));
    setShowDropdown(false); // Close the dropdown when a popup is opened
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo" aria-label="Home">
          {logo ? (
            <img src={`/${logo}`} alt="Matrix Logo" className="logo" />
          ) : error ? (
            <p>Logo not available</p>
          ) : (
            <p>Loading...</p>
          )}
        </Link>

        <ul className="nav-links">
          <li><Link to="/strict/teachers" className="nav-link">Teacher</Link></li>
          <li><Link to="/strict/timetable" className="nav-link">TimeTable</Link></li>
          <li><Link to="/strict/library" className="nav-link">Library</Link></li>
          <li><Link to="/strict/blogs" className="nav-link">Blog</Link></li>
          <li><Link to="/strict/tips" className="nav-link">Tips</Link></li>
          <li><Link to="/strict/contact" className="nav-link">Contact Us</Link></li>
        </ul>

        <div className="sign-in-dropdown">
          <button
            className="sign-in-button"
            onClick={handleDropdownToggle}
            aria-haspopup="true"
            aria-expanded={showDropdown ? 'true' : 'false'}
          >
            Sign In
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => handlePopupToggle('student')} className="dropdown-link">
                Student Sign-In
              </button>
              <button onClick={() => handlePopupToggle('staff')} className="dropdown-link">
                Staff Sign-In
              </button>
              <button onClick={() => handlePopupToggle('admin')} className="dropdown-link">
                Admin Sign-In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render popups based on activePopup */}
      {activePopup === 'student' && <StudentSignIn onClose={() => setActivePopup('')} />}
      {activePopup === 'staff' && <StaffSignIn onClose={() => setActivePopup('')} />}
      {activePopup === 'admin' && <AdminSignIn onClose={() => setActivePopup('')} />}
    </nav>
  );
};

export default Navbar;
