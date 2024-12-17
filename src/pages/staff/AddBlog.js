import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './css/AddBlog.css';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the request payload
    const blogData = {
      title,
      image,
      content,
    };

    try {
      // Send the POST request to the API
      const response = await axios.post(`${config.apiUrl}/staff/add-blogs`, blogData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensures cookies/session data are sent for authentication
      });

      // Handle success
      if (response.status === 201) {
        alert('Blog created successfully');
        // Reset the form and navigate back to the Add New page
        setTitle('');
        setContent('');
        setImage('');
        navigate('/staff/add-new');
      }
    } catch (error) {
      // Handle errors (e.g., validation or server errors)
      console.error('Error:', error.response || error);
      setError(
        error.response && error.response.data.errors
          ? error.response.data.errors.map((err) => err.msg).join(', ')
          : 'Failed to create the blog. Please try again.'
      );
    }
  };

  const handleCancel = () => {
    navigate('/staff/add-new'); // Navigate back to Add New page
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Content:</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          placeholder="Write your blog content"
        />
      </div>

      <div className="form-group">
        <label>Image URL:</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="button-group">
        <button type="submit" className="submit-button">Publish Blog</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
