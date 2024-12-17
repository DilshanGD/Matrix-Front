import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import config from '../../config';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');  // New state for username
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = {
      title,
      content,  // Content will be HTML formatted text from React Quill
      image,
      username,  // Added username to the blog data
    };

    try {
      // Send the blog data to the backend API using Axios
      const response = await axios.post(`${config.apiUrl}/staff/add-blogs`, blogData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response
      if (response.status === 201) {
        alert('Blog created successfully');
        // Optionally reset the form here
        setTitle('');
        setContent('');
        setImage('');
        setUsername('');  // Reset username
      }
    } catch (error) {
      // Handle errors (e.g., validation issues, network errors)
      console.error('Error:', error.response || error);
      setError(error.response ? error.response.data.error : 'Failed to create blog');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Content:</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          placeholder="Write your blog content"
        />
      </div>

      <div>
        <label>Image URL:</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <button type="submit">Publish Blog</button>
    </form>
  );
};

export default BlogForm;
