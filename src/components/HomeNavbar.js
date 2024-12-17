import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentSignIn from '../pages/student/StudentSignIn';
import StaffSignIn from '../pages/staff/StaffSignIn';
import AdminSignIn from '../pages/admin/AdminSignIn';
import './css/HomeNavbar.css';

const HomeNavbar = ({ logo }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePopup, setActivePopup] = useState('');

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  const handlePopupToggle = (popup) => {
    setActivePopup((current) => (current === popup ? '' : popup));
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.sign-in')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <nav className="navbar">
      {logo ? (
        <img
          src={logo}
          alt="Matrix Logo"
          className="logo"
          onError={(e) => { e.target.src = '/path/to/default-logo.png'; }}
        />
      ) : (
        <p>Loading logo...</p>
      )}

      <ul className="nav-links">
        <li><Link to="/strict/teachers">Teacher</Link></li>
        <li><Link to="/strict/timetable">TimeTable</Link></li>
        <li><Link to="/strict/library">Library</Link></li>
        <li><Link to="/strict/blogs">Blog</Link></li>
        <li><Link to="/strict/tips">Tips</Link></li>
        <li><Link to="/strict/contact">Contact Us</Link></li>
      </ul>

      <div className="sign-in-dropdown">
        <button
          className="sign-in"
          onClick={handleDropdownToggle}
          aria-haspopup="true"
          aria-expanded={showDropdown ? 'true' : 'false'}
        >
          Sign In
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <button className="dropdown-link" onClick={() => handlePopupToggle('student')}>
              Student Sign-In
            </button>
            <button className="dropdown-link" onClick={() => handlePopupToggle('staff')}>
              Staff Sign-In
            </button>
            <button className="dropdown-link" onClick={() => handlePopupToggle('admin')}>
              Admin Sign-In
            </button>
          </div>
        )}
      </div>

      {activePopup === 'student' && <StudentSignIn onClose={() => setActivePopup('')} />}
      {activePopup === 'staff' && <StaffSignIn onClose={() => setActivePopup('')} />}
      {activePopup === 'admin' && <AdminSignIn onClose={() => setActivePopup('')} />}
    </nav>
  );
};

export default HomeNavbar;
