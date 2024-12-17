// frontend/src/pages/common/StrictPage.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Teachers from './Teachers'; 
import TipsPage from './TipsPage';
import BlogPage from './BlogPage';
import Library from './Library';
import SubjectBooks from './SubjectBooks';

const StrictPage = () => {
  return (
    <div className="strict-page">
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="teachers" element={<Teachers />} />
          <Route path="tips" element={<TipsPage />} />
          <Route path="blogs" element={<BlogPage />} />
          <Route path="library" element={<Library />} />
          <Route path="/library/subject/:subtitle" element={<SubjectBooks />} />
        </Routes>
      </div>
    </div>
  );
};

export default StrictPage;
