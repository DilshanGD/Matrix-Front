import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Streams.css'; // Custom styles for Streams.js
import config from '../../config';

const Streams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStreamData = async () => {
    setLoading(true);
    setError(null); // Reset error state on retry

    try {
      const response = await axios.get(`${config.apiUrl}/admin/stream-view`, { withCredentials: true });
      setStreams(response.data || []); // Default to an empty array if null
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stream data:', err);
      setError('Failed to load stream data');
      setLoading(false);
    }
  };

  const removeStream = async (streamId) => {
    if (window.confirm('Are you sure you want to remove this stream?')) {
      try {
        const response = await axios.delete(`${config.apiUrl}/admin/stream-remove`, {
          data: { stream_id: streamId },
          withCredentials: true
        });
        if (response.status === 200) {
          alert('Stream removed successfully.');
          fetchStreamData(); // Refresh the stream list
        }
      } catch (err) {
        console.error('Error removing stream:', err.message);
        alert('Failed to remove stream.');
      }
    }
  };

  useEffect(() => {
    fetchStreamData(); // Fetch stream data when the component is mounted
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div> {/* Visual spinner */}
        <p>Loading stream data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchStreamData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="streams-container">
      <h1>Streams</h1>
      {streams.length === 0 ? (
        <p>No streams available.</p>
      ) : (
        streams.map((stream) => (
          <div key={stream.stream_id} className="stream-block">
            <p>{stream.title}</p>
            <button onClick={() => removeStream(stream.stream_id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Streams;
