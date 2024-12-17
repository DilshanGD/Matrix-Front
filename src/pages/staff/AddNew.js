import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/AddNew.css';
import config from '../../config';

const AddNew = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [showAddClassPopup, setShowAddClassPopup] = useState(false);
  const [showAddBookPopup, setShowAddBookPopup] = useState(false);
  const [showAddTipPopup, setShowAddTipPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    fee: '',
    location: '',
    day: '',
    startTime: '',
    endTime: '',
    batch_id: '',
  });
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    image: '',
    source: '',
  });
  const [tipData, setTipData] = useState({
    title: '',
    source: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/staff/new-class-registration`, { withCredentials: true });
        setBatches(response.data.batches); // Only using the batches data
      } catch (err) {
        console.error('Error fetching batches:', err);
        setError('Failed to load batches. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleTipChange = (e) => {
    const { name, value } = e.target;
    setTipData({ ...tipData, [name]: value });
  };

  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiUrl}/staff/add-books`, bookData, { withCredentials: true });
      setShowAddBookPopup(false);
      setBookData({ title: '', author: '', image: '', source: '' });
      setError('');
      window.location.reload(); // Reload the page to reflect the newly added book
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.message || 'Failed to add book.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiUrl}/staff/class-registration`, formData, { withCredentials: true });
      setShowAddClassPopup(false);
      setFormData({
        title: '',
        type: '',
        fee: '',
        location: '',
        day: '',
        startTime: '',
        endTime: '',
        batch_id: '',
      });
      setError('');
      window.location.reload(); // Reload the page to reflect the newly added class
    } catch (err) {
      console.error('Error adding class:', err);
      setError(err.response?.data?.message || 'Failed to add class.');
    }
  };

  const handleAddTipSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiUrl}/staff/add-tips`, tipData, { withCredentials: true });
      setShowAddTipPopup(false);
      setTipData({ title: '', source: '' });
      setError('');
      window.location.reload(); // Reload the page to reflect the newly added tip
    } catch (err) {
      console.error('Error adding tip:', err);
      setError(err.response?.data?.message || 'Failed to add tip.');
    }
  };

  return (
    <div className="add-new-container">
      <h1 className="page-title">Add New Content</h1>
      <div className="button-container">
        <button className="add-button" onClick={() => navigate('/staff/add-blog')}>
          Add Blog
        </button>
        <button className="add-button" onClick={() => setShowAddClassPopup(true)}>
          Add Class
        </button>
        <button className="add-button" onClick={() => setShowAddBookPopup(true)}>
          Add Books
        </button>
        <button className="add-button" onClick={() => setShowAddTipPopup(true)}>
          Add Tips
        </button>
      </div>

      {showAddClassPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add Class</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Type:
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Theory">Theory</option>
                  <option value="Revision">Revision</option>
                  <option value="Paper">Paper</option>
                </select>
              </label>
              <label>
                Fee:
                <input
                  type="number"
                  step="0.01"
                  name="fee"
                  value={formData.fee}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Day:
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </label>
              <label>
                Start Time:
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Batch ID:
                <select
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch, index) => (
                    <option key={index} value={batch.batch_id}>
                      {batch.batch_id}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Add Class</button>
              <button type="button" onClick={() => setShowAddClassPopup(false)}>
                Cancel
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}

      {showAddBookPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add Book</h2>
            <form onSubmit={handleAddBookSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={bookData.title}
                  onChange={handleBookChange}
                  required
                />
              </label>
              <label>
                Author:
                <input
                  type="text"
                  name="author"
                  value={bookData.author}
                  onChange={handleBookChange}
                  required
                />
              </label>
              <label>
                Image:
                <input
                  type="text"
                  name="image"
                  value={bookData.image}
                  onChange={handleBookChange}
                  required
                />
              </label>
              <label>
                Source:
                <input
                  type="text"
                  name="source"
                  value={bookData.source}
                  onChange={handleBookChange}
                  required
                />
              </label>
              <button type="submit">Add Book</button>
              <button type="button" onClick={() => setShowAddBookPopup(false)}>
                Cancel
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}

      {showAddTipPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add Tip</h2>
            <form onSubmit={handleAddTipSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={tipData.title}
                  onChange={handleTipChange}
                  required
                />
              </label>
              <label>
                Source URL:
                <input
                  type="text"
                  name="source"
                  value={tipData.source}
                  onChange={handleTipChange}
                  required
                />
              </label>
              <button type="submit">Add Tip</button>
              <button type="button" onClick={() => setShowAddTipPopup(false)}>
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
