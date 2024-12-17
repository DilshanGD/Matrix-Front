import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link for routing
import StudentSignIn from '../pages/student/StudentSignIn'; // Import the StudentSignIn component
import StaffSignIn from '../pages/staff/StaffSignIn'; // Import the StaffSignIn component
import './css/HomeNavbar.css';

const HomeNavbar = ({ logo }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStudentSignIn, setShowStudentSignIn] = useState(false); // State to show the StudentSignIn component

  // Function to toggle the dropdown visibility
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to close the student sign-in popup
  const handleStudentSignInClose = () => {
    setShowStudentSignIn(false);
    setShowDropdown(false); // Close the dropdown when the sign-in form is closed
  };

  return (
    <nav className="navbar">
      {logo ? (
        <img src={logo} alt="Matrix Logo" className="logo" />
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
          aria-expanded={showDropdown ? "true" : "false"}
        >
          Sign In
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <button
              className="dropdown-link"
              onClick={() => setShowStudentSignIn(true)} // Show StudentSignIn form when clicked
            >
              Student Sign-In
            </button>
            <Link to="/teacher-login" className="dropdown-link">Teacher Sign-In</Link>
            <Link to="/admin-login" className="dropdown-link">Admin Sign-In</Link>
          </div>
        )}
      </div>

      {showStudentSignIn && <StudentSignIn onClose={handleStudentSignInClose} />}
    </nav>
  );
};

export default HomeNavbar;
