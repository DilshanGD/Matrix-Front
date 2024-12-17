// frontend/src/components/StatisticsSection.js

import React from 'react';
import './css/StatisticsSection.css';

const StatisticsSection = ({ statistics }) => (
  <section className="statistics">
    <div className="stat-item">
      <i className="icon-class"></i>
      <p>Total Classes</p>
      <h3>{statistics.totalClasses}</h3>
    </div>
    <div className="stat-item">
      <i className="icon-teacher"></i>
      <p>Expert Teachers</p>
      <h3>{statistics.totalStaff}</h3>
    </div>
    <div className="stat-item">
      <i className="icon-student"></i>
      <p>Total Students</p>
      <h3>{statistics.totalStudents}</h3>
    </div>
  </section>
);

export default StatisticsSection;
