import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/IndividualTeacher.css';
import config from '../../config';

const IndividualTeacher = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = state?.username; // Expecting username passed in state from previous page

  const fetchTeacherData = useCallback(async () => {
    if (!username) {
      setError("No username provided. Please select a teacher.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${config.apiUrl}/staff-individual`, { username });
      setTeacherData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching teacher data:", err);
      setError("Failed to load teacher data.");
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  if (loading) {
    return <p>Loading teacher data...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!teacherData) {
    return <p>No teacher data available. Please select a teacher from the list.</p>;
  }

  const {
    full_name,
    email,
    profile_pic,
    biography,
    subject,
    phone,
    class: classes,
    //staffQualification,
  } = teacherData;

  return (
    <div className="individual-teacher-container">
      <div className="profile-section">
        <img src={profile_pic} alt={`${full_name}'s profile`} className="profile-pic-large" />
        <h1>{full_name}</h1>
        <p><strong>Subject:</strong> {subject}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>
      <div className="details-section">
        <h2>Biography</h2>
        <p>{biography}</p>
        {/* <h2>Qualifications</h2>
        <ul>
          {staffQualification.map((qual, index) => (
            <li key={index}>
              {qual.title} - {qual.institute}
            </li>
          ))}
        </ul> */}
        <h2>Contact Numbers</h2>
        <ul>
          {phone.map((contact, index) => (
            <li key={index}>
              {contact.phoneType}: {contact.phone}
            </li>
          ))}
        </ul>
        <h2>Classes</h2>
        {classes.map((cls, index) => (
          <div key={index} className="class-details">
            <p><strong>Title:</strong> {cls.title}</p>
            <p><strong>Type:</strong> {cls.type}</p>
            <p><strong>Location:</strong> {cls.location}</p>
            <p><strong>Day:</strong> {cls.day}</p>
            <p><strong>Time:</strong> {cls.startTime} - {cls.endTime}</p>
            <p><strong>Fee:</strong> {cls.fee}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndividualTeacher;
