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
  const [showChangeTitlePopup, setShowChangeTitlePopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
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

  const handleChangeTitle = (classItem) => {
    // Ensure currentClass includes oldTitle and newTitle
    setCurrentClass({ ...classItem, oldTitle: classItem.title });
    setShowChangeTitlePopup(true);
  };

  const handleRemove = (classItem) => {
    setCurrentClass(classItem);
    setShowRemovePopup(true);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setShowChangeTitlePopup(false);
    setShowRemovePopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass({ ...currentClass, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditPopup) {
        await axios.patch(`${config.apiUrl}/staff/class-update`, currentClass, { withCredentials: true });
      } else if (showChangeTitlePopup) {
        const { oldTitle, newTitle } = currentClass;
        await axios.patch(`${config.apiUrl}/staff/new-class-title`, { oldTitle, newTitle }, { withCredentials: true });
      } else if (showRemovePopup) {
        await confirmRemove();
      }
      setShowEditPopup(false); // Close edit popup after successful update
      setShowChangeTitlePopup(false); // Close change title popup after successful update
      window.location.href = '/staff/Classes'; // Navigate to the Classes page
    } catch (err) {
      console.error('Error updating class:', err);
      setError(err.response?.data?.message || 'Failed to update class.');
    }
  };

  const confirmRemove = async () => {
    try {
      await axios.delete(`${config.apiUrl}/staff/remove-class`, {
        data: { title: currentClass.title },
        withCredentials: true
      });
      setClasses(classes.filter(cls => cls.title !== currentClass.title));
      setShowRemovePopup(false);
    } catch (err) {
      console.error('Error removing class:', err);
      setError(err.response?.data?.message || 'Failed to remove class.');
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
              <button onClick={() => handleChangeTitle(classItem)}>Change Title</button>
              <button onClick={() => handleRemove(classItem)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Edit Class</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <h3>{currentClass.title || ''}</h3>
              </label>
              <label>
                Type:
                <select name="type" value={currentClass.type || ''} onChange={handleInputChange}>
                  <option value="Theory">Theory</option>
                  <option value="Revision">Revision</option>
                </select>
              </label>
              <label>
                Location:
                <input type="text" name="location" value={currentClass.location || ''} onChange={handleInputChange} />
              </label>
              <label>
                Day:
                <select name="day" value={currentClass.day || ''} onChange={handleInputChange}>
                  {dayOrder.map((day, index) => (
                    <option key={index} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Start Time:
                <input type="time" name="startTime" value={currentClass.startTime || ''} onChange={handleInputChange} />
              </label>
              <label>
                End Time:
                <input type="time" name="endTime" value={currentClass.endTime || ''} onChange={handleInputChange} />
              </label>
              <label>
                Fee:
                <input type="number" step="0.01" name="fee" value={currentClass.fee || ''} onChange={handleInputChange} />
              </label>
              <label>
                Batch ID:
                <select name="batch_id" value={currentClass.batch_id || ''} onChange={handleInputChange}>
                  {batches.map((batch, index) => (
                    <option key={index} value={batch.batch_id}>
                      {batch.batch_id}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subject ID:
                <select name="sub_id" value={currentClass.sub_id || ''} onChange={handleInputChange}>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject.sub_id}>
                      {subject.title}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={handleClosePopup}>Cancel</button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {/* Change Title Popup */}
      {showChangeTitlePopup && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Change Class Title</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Old Title:
                <input type="text" name="oldTitle" value={currentClass.oldTitle || ''} readOnly />
              </label>
              <label>
                New Title:
                <input type="text" name="newTitle" value={currentClass.newTitle || ''} onChange={handleInputChange} />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={handleClosePopup}>Cancel</button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {/* Remove Popup */}
      {showRemovePopup && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h3>Are you sure you want to remove {currentClass.title}?</h3>
            <button onClick={confirmRemove}>Yes</button>
            <button onClick={handleClosePopup}>No</button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
