// frontend/src/pages/student/Student.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StudentTopbar from './components/StudentTopbar';
import StudentSidebar from './components/StudentSidebar';
import StudentProfile from './StudentProfile';
import './css/Student.css'; // Import the CSS file for styling

const Student = () => {
  return (
    <div className="student-page">
      <StudentTopbar />
      <div className="student-body">
        <StudentSidebar />
        <div className="page-content">
          <Routes>
            <Route path="/StudentProfile" element={<StudentProfile />} />
            {/* Add your routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Student;
