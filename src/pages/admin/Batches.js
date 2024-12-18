import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Batches.css'; // Custom styles for Batches.js
import config from '../../config';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatchData = async () => {
    setLoading(true);
    setError(null); // Reset error state on retry

    try {
      const response = await axios.get(`${config.apiUrl}/admin/batch-view`, { withCredentials: true });
      setBatches(response.data || []); // Default to an empty array if null
      setLoading(false);
    } catch (err) {
      console.error('Error fetching batch data:', err);
      setError('Failed to load batch data');
      setLoading(false);
    }
  };

  const removeBatch = async (batchId) => {
    if (window.confirm('Are you sure you want to remove this batch?')) {
      try {
        const response = await axios.delete(`${config.apiUrl}/admin/batch-remove`, {
          data: { batch_id: batchId },
          withCredentials: true
        });
        if (response.status === 200) {
          alert('Batch removed successfully.');
          fetchBatchData(); // Refresh the batch list
        }
      } catch (err) {
        console.error('Error removing batch:', err.message);
        alert('Failed to remove batch.');
      }
    }
  };

  useEffect(() => {
    fetchBatchData(); // Fetch batch data when the component is mounted
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div> {/* Visual spinner */}
        <p>Loading batch data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchBatchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="batches-container">
      <h1>Batches</h1>
      {batches.length === 0 ? (
        <p>No batches available.</p>
      ) : (
        batches.map((batch) => (
          <div key={batch.batch_id} className="batch-block">
            <p>{batch.batch_id}</p>
            <button onClick={() => removeBatch(batch.batch_id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Batches;
