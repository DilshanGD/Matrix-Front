// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactHomePage from './pages/common/ReactHomePage';
import StudentRegistration from './pages/student/StudentRegistration'; 
import AddBlog from './pages/staff/AddBlog'; 
import StrictPage from './pages/common/StrictPage';
import Student from './pages/student/Student';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReactHomePage />} />
        <Route path="/strict/*" element={<StrictPage />} />
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="/staff/add-blog" element={<AddBlog />} />
        <Route path="/student/*" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
