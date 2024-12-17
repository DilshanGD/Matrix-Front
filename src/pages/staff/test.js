import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config'; // Ensure this contains your API base URL
import './css/Classes.css';

const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentClass, setCurrentClass] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    // Update the current time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classResponse = await axios.get(`${config.apiUrl}/staff/class-view`, { withCredentials: true });
        const subjectBatchResponse = await axios.get(`${config.apiUrl}/staff/new-class-registration`, { withCredentials: true });

        setClasses(classResponse.data);
        setSubjects(subjectBatchResponse.data.subjects);
        setBatches(subjectBatchResponse.data.batches);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes or registration data:', err);
        setError(err.response?.data?.message || 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass({ ...currentClass, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${config.apiUrl}/staff/class-update`, currentClass, { withCredentials: true });
      setShowEditPopup(false); // Close popup after successful update
      window.location.href = '/staff/Classes'; // Navigate to the Classes page
    } catch (err) {
      console.error('Error updating class:', err);
      setError(err.response?.data?.message || 'Failed to update class.');
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="staff-dashboard">
      <div className="current-datetime">
        <p className="date">{formatDate(currentDateTime)}</p>
        <p className="time">{formatTime(currentDateTime)}</p>
      </div>

      <div className="classes-container">
        {classes.map((classItem, index) => (
          <div key={index} className="class-block">
            <h3>{classItem.title}</h3>
            <p>Type: {classItem.type}</p>
            <p>Location: {classItem.location}</p>
            <p>Day: {classItem.day}</p>
            <p>Start Time: {classItem.startTime}</p>
            <p>End Time: {classItem.endTime}</p>
            <p>Fee: {classItem.fee}</p>
            <p>Batch ID: {classItem.batch_id}</p>
            <p>Subject ID: {classItem.sub_id}</p>
            <div className="class-actions">
              <button onClick={() => handleEdit(classItem)}>Edit</button>
              <button>Change Title</button>
              <button>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Change Title Popup */}
      {showEditPopup && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Change Class Title</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <input type="text" name="title" value={currentClass.title || ''} onChange={handleInputChange} />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={handleClosePopup}>Cancel</button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
