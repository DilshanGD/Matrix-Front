// frontend/src/pages/staff/Staff.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StaffTopbar from './components/StaffTopbar';
import StaffSidebar from './components/StaffSidebar';
//import StaffProfile from './StaffProfile';
import './css/Staff.css'; // Import the CSS file for styling
import StaffDashboard from './StaffDashboard';
import Classes from './Classes';

const Staff = () => {
  return (
    <div className="student-page">
      <StaffTopbar />
      <div className="student-body">
        <StaffSidebar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<StaffDashboard />} />
            <Route path="/classes" element={<Classes />} />
            {/* <Route path="/StudentProfile" element={<StudentProfile />} /> */}
            {/* Add your routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Staff;
