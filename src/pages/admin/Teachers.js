import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Teachers.css'; // Custom styles for Teachers.js
import config from '../../config';

const Teachers = () => {
  const [staffGroups, setStaffGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaffData = async () => {
    setLoading(true);
    setError(null); // Reset error state on retry

    try {
      const response = await axios.get(`${config.apiUrl}/staff`,{ withCredentials: true });
      setStaffGroups(response.data.staffGroups || {}); // Default to an empty object if null
      setLoading(false);
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError('Failed to load staff data');
      setLoading(false);
    }
  };

  const removeStaff = async (username) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        const response = await axios.delete(`${config.apiUrl}/admin/staff-remove`, {
          data: { username },
          withCredentials: true
        });
        if (response.status === 200) {
          alert('Staff member removed successfully.');
          window.location.href = '/admin/teachers';
        }
      } catch (err) {
        console.error('Error removing staff:', err.message);
        alert('Failed to remove staff member.');
        // window.location.href = '/admin/teachers';
      }
    }
  };

  useEffect(() => {
    fetchStaffData(); // Fetch staff data when the component is mounted
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div> {/* Visual spinner */}
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

  // Render staff grouped by stream and subject
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
                      <ul>
                        {subjectStaff.map((staffMember) => (
                          <li key={staffMember.username} className="staff-member">
                            <img
                              src={staffMember.profile_pic}
                              alt={`${staffMember.full_name}'s profile`}
                              className="profile-pic"
                            />
                            <div className="staff-info">
                              <p><strong>{staffMember.full_name}</strong></p>
                              <p>Email: {staffMember.email}</p>
                              <button onClick={() => removeStaff(staffMember.username)}>Remove</button>
                            </div>
                          </li>
                        ))}
                      </ul>
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
