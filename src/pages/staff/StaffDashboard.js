// frontend/src/pages/staff/StaffDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/StaffDashboard.css';
import StaffSidebar from './StaffSidebar';
import StaffTopbar from './StaffTopbar';
import config from '../../../config';

const StaffDashboard = () => {
  const [staffClasses, setStaffClasses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch staff timetable data from API
    const fetchTimetable = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/staff/timetable`, {
          withCredentials: true, // Necessary to send session cookies
        });
        setStaffClasses(response.data);
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError(err.response?.data || 'Failed to load timetable');
      }
    };

    fetchTimetable();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (staffClasses.length === 0) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <StaffSidebar />
      <div className="dashboard-content">
        <StaffTopbar />
        
        <div className="staff-dashboard">
          <h1>Timetable</h1>
          <table className="classes-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Batch ID</th>
              </tr>
            </thead>
            <tbody>
              {staffClasses.map((cls, index) => (
                <tr key={index}>
                  <td>{cls.title}</td>
                  <td>{cls.type}</td>
                  <td>{cls.day}</td>
                  <td>{cls.startTime}</td>
                  <td>{cls.endTime}</td>
                  <td>{cls.batch_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
