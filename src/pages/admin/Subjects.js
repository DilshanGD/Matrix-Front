import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Subjects.css'; // Custom styles for Subjects.js
import config from '../../config';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null); // Reset error state on retry

    try {
      const response = await axios.get(`${config.apiUrl}/admin/subject-view`, { withCredentials: true });
      setSubjects(response.data || []); // Default to an empty array if null
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects');
      setLoading(false);
    }
  };

  const removeSubject = async (sub_id) => {
    if (window.confirm('Are you sure you want to remove this subject?')) {
      try {
        const response = await axios.delete(`${config.apiUrl}/admin/subject-remove`, {
          data: { sub_id },
          withCredentials: true
        });
        if (response.status === 200) {
          alert('Subject removed successfully.');
          fetchSubjects(); // Refresh subjects list
        }
      } catch (err) {
        console.error('Error removing subject:', err.message);
        alert('Failed to remove subject.');
      }
    }
  };

  useEffect(() => {
    fetchSubjects(); // Fetch subjects data when the component is mounted
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div> {/* Visual spinner */}
        <p>Loading subjects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchSubjects}>Retry</button>
      </div>
    );
  }

  return (
    <div className="subjects-container">
      <h1>Subjects</h1>
      {subjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        subjects.map(subject => (
          <div key={subject.sub_id} className="subject-block">
            <p><strong>{subject.title}</strong> (ID: {subject.sub_id})</p>
            <button onClick={() => removeSubject(subject.sub_id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Subjects;
