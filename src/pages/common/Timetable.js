// frontend/src/pages/common/Timetable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Timetable.css'; // Ensure this file contains styles for the timetable
import config from '../../config'; // Import your API URL configuration

const Timetable = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch timetable data from the API
  const fetchTimetableData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${config.apiUrl}/timetable`);
      setTimetableData(response.data.class); // Assume `response.data.class` contains the timetable
      setLoading(false);
    } catch (err) {
      console.error('Error fetching timetable data:', err);
      setError('Failed to load timetable data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetableData(); // Fetch data on component mount
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading timetable...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchTimetableData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="timetable-container">
      <h1>Class Timetable</h1>
      {timetableData.length === 0 ? (
        <p>No timetable data available.</p>
      ) : (
        timetableData.map((subjectGroup, index) => (
          <div key={index} className="subject-group">
            <h2>{subjectGroup.subject}</h2>
            <div className="class-list">
              {subjectGroup.classes.map((cls, classIndex) => (
                <div key={classIndex} className="class-card">
                  <h3>{cls.title}</h3>
                  <p><strong>Type:</strong> {cls.type}</p>
                  <p><strong>Location:</strong> {cls.location}</p>
                  <p><strong>Day:</strong> {cls.day}</p>
                  <p><strong>Time:</strong> {cls.startTime} - {cls.endTime}</p>
                  <p><strong>Batch:</strong> {cls.batch || 'N/A'}</p>
                  <p><strong>Fee:</strong> {cls.fee}</p>
                  <p><strong>Staff:</strong> {cls.staff_full_name}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Timetable;
