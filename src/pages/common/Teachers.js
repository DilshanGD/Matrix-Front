import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Teachers.css';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const Teachers = () => {
  const [staffGroups, setStaffGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStaffData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${config.apiUrl}/staff`);
      setStaffGroups(response.data.staffGroups);
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError('Failed to load staff data.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherClick = async (username) => {
    try {
      const response = await axios.post(`${config.apiUrl}/staff-individual`, { username });
      navigate('/individual-teacher', { state: { teacherData: response.data } });
    } catch (err) {
      console.error('Error fetching individual teacher data:', err);
      alert('Failed to fetch teacher details. Please try again.');
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div>
        <p>Loading staff data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchStaffData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="teachers-container">
      <div className="teachers-content">
        <h1>Teachers</h1>
        {Object.keys(staffGroups).length === 0 ? (
          <p>No staff available.</p>
        ) : (
          Object.keys(staffGroups).map((streamId) => {
            const stream = staffGroups[streamId];
            return (
              <div key={streamId} className="stream-group">
                <h2>{stream.title}</h2>
                {Object.keys(stream.subjects).map((subjectTitle) => {
                  const subjectStaff = stream.subjects[subjectTitle];
                  return (
                    <div key={subjectTitle} className="subject-group">
                      <h3>{subjectTitle}</h3>
                      <div className="teacher-blocks">
                        {subjectStaff.map((staffMember) => (
                          <div
                            key={staffMember.username}
                            className="teacher-block"
                            onClick={() => handleTeacherClick(staffMember.username)}
                          >
                            <img
                              src={staffMember.profile_pic}
                              alt={`${staffMember.full_name}'s profile`}
                              className="profile-pic"
                            />
                            <p>{staffMember.full_name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Teachers;
