// frontend/src/pages/student/components/StudentTopbar.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/StudentTopbar.css';
import config from '../../../config';

const StudentTopbar = () => {
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student topbar data from the API
    const fetchStudentData = async () => {
      try {
        const response = await axios.post(`${config.apiUrl}/student/student-topbar`, {}, 
          {
            withCredentials: true, // Necessary to send session cookies
          }
        );
        console.log("Data retrieved from API:", response.data); // Debugging log
        setStudentData(response.data);
      } catch (err) {
        console.error("Error fetching student data:", err);     // Debugging log
        setError(err.response?.data || 'Failed to load student data');
      }
    };

    fetchStudentData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!studentData) {
    return <div className="loading-message">Loading...</div>;
  }

  console.log("Rendering StudentTopbar with full name:", studentData);
  console.log("Rendering reg_no:", studentData);

  return (
    <div className="student-topbar">
      {/* Left side: Navigation Logo */}
      <div className="nav-logo">
        <img 
          src={`/${studentData.nav_logo || 'default-logo.png'}`} 
          alt="Navigation Logo" 
          className="nav-logo-img" 
        />
      </div>

      {/* Middle: Student Full Name and Reg Number */}
      <div className="student-info">
        <p className="student-full-name">{studentData.full_name}</p>
        <p className="student-reg-no">{studentData.reg_no}</p>
      </div>

      {/* Right side: Profile Picture */}
      <div className="profile-pic">
        <img
          src={`/${studentData.profile_pic || 'default-profile.png'}`}
          alt={`${studentData.full_name}'s profile`}
          className="profile-pic-img"
        />
      </div>
    </div>
  );
};

export default StudentTopbar;
