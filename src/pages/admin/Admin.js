// frontend/src/pages/Admin/Admin.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminTopbar from './components/AdminTopbar';
import AdminSidebar from './components/AdminSidebar';
import './css/Admin.css'; // Import the CSS file for styling
import AdminDashboard from './AdminDashboard';
import Teachers from './Teachers';
import AddNew from './AddNew';
import Subjects from './Subjects';
import Batches from './Batches';
import Streams from './Streams';

const Admin = () => {
  return (
    <div className="student-page">
      <AdminTopbar />
      <div className="student-body">
        <AdminSidebar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/add-new" element={<AddNew />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/streams" element={<Streams />} />
            {/* Add your routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
