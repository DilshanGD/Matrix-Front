import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import './css/AddNew.css';
import config from '../../config';

const AddNew = () => {
  //const navigate = useNavigate();
  //const [batches, setBatches] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]); // Add subjects state
  const [showPopup, setShowPopup] = useState('');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const handleOpenPopup = (type) => {
    setFormData({}); // Clear form data
    setShowPopup(type);
  };

  const handleClosePopup = () => {
    setShowPopup('');
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsResponse = await axios.get(`${config.apiUrl}/admin/subject-view`, { withCredentials: true });
        setSubjects(subjectsResponse.data || []);
        
        const streamsResponse = await axios.get(`${config.apiUrl}/admin/stream-view`, { withCredentials: true });
        setStreams(streamsResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (endpoint) => {
    try {
      await axios.post(`${config.apiUrl}${endpoint}`, formData, { withCredentials: true });
      handleClosePopup();
      setError('');
      window.location.reload();
    } catch (err) {
      console.error('Error submitting data:', err);
      setError(err.response?.data?.message || 'Failed to submit data.');
    }
  };

  return (
    <div className="add-new-container">
      <h1 className="page-title">Add New Content</h1>
      <div className="button-container">
        <button className="add-button" onClick={() => handleOpenPopup('staff')}>
          Add Staff
        </button>
        <button className="add-button" onClick={() => handleOpenPopup('batch')}>
          Add Batch
        </button>
        <button className="add-button" onClick={() => handleOpenPopup('stream')}>
          Add Stream
        </button>
        <button className="add-button" onClick={() => handleOpenPopup('subject')}>
          Add Subject
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{`Add ${showPopup.charAt(0).toUpperCase() + showPopup.slice(1)}`}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const endpoints = {
                  batch: '/admin/batch-registration',
                  stream: '/admin/stream-registration',
                  subject: '/admin/sub-registration',
                  staff: '/admin/staff-registration',
                };
                handleSubmit(endpoints[showPopup]);
              }}
            >
              {showPopup === 'batch' && (
                <label>
                  Batch ID:
                  <input type="text" name="batch_id" value={formData.batch_id || ''} onChange={handleFormChange} required />
                </label>
              )}
              {showPopup === 'stream' && (
                <>
                  <label>
                    Stream ID:
                    <input type="text" name="stream_id" value={formData.stream_id || ''} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Title:
                    <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} required />
                  </label>
                </>
              )}
              {showPopup === 'subject' && (
                <>
                  <label>
                    Stream:
                    <select name="stream_id" value={formData.stream_id || ''} onChange={handleFormChange} required>
                      <option value="" disabled>Select a Stream</option>
                      {streams.map((stream, index) => (
                        <option key={index} value={stream.stream_id}>
                          {stream.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Title:
                    <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Subject ID:
                    <input type="text" name="sub_id" value={formData.sub_id || ''} onChange={handleFormChange} required />
                  </label>
                </>
              )}
              {showPopup === 'staff' && (
                <>
                  <label>
                    Username:
                    <input type="text" name="username" value={formData.username || ''} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Full Name:
                    <input type="text" name="full_name" value={formData.full_name || ''} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Email:
                    <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Subject ID:
                    <select name="sub_id" value={formData.sub_id || ''} onChange={handleFormChange} required>
                      <option value="" disabled>Select a Subject</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject.sub_id}>
                          {subject.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Gender:
                    <select name="gender" value={formData.gender || 'Male'} onChange={handleFormChange} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </label>
                </>
              )}
              <button type="submit">Submit</button>
              <button type="button" onClick={handleClosePopup}>
                Cancel
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNew;
