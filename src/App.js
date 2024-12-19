// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactHomePage from './pages/common/ReactHomePage'; 
import StrictPage from './pages/common/StrictPage';
// import Student from './pages/student/Student';
import Staff from './pages/staff/Staff';
import Admin from './pages/admin/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReactHomePage />} />
        <Route path="/strict/*" element={<StrictPage />} />
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
