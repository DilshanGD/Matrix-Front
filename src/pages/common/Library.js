// frontend/src/pages/common/Library.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Library.css';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const Library = () => {
  const [bookGroups, setBookGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch library data
  const fetchLibraryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${config.apiUrl}/library`);
      const initialBookGroups = response.data.initialBookGroups;

      setBookGroups(initialBookGroups);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching library data:', err);
      setError('Failed to load library data');
      setLoading(false);
    }
  };

  // Navigate to the subject page showing all books with sub_id and subtitle as query parameters
  const viewSubjectBooks = (subId, subjectTitle) => {
    // Navigate and pass sub_id and subtitle as query parameters
    navigate(`/strict/library/subject/${subjectTitle}?sub_id=${subId}`);
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div>
        <p>Loading library data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchLibraryData} disabled={loading}>
          {loading ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  // Render books grouped by stream and subject
  return (
    <div className="library-container">
      <div className="library-content">
        <h1>Library</h1>
        {Object.keys(bookGroups).length === 0 ? (
          <p>No books available.</p>
        ) : (
          Object.keys(bookGroups).map((streamId) => {
            const stream = bookGroups[streamId];
            return (
              <div key={streamId} className="stream-group">
                <h2>{stream.title}</h2>
                {Object.keys(stream.subjects).map((subjectTitle) => {
                  const subject = stream.subjects[subjectTitle];
                  const displayedBooks = subject.books.slice(0, 8); // Display first 8 books initially

                  return (
                    <div key={subjectTitle} className="subject-group">
                      <h3>{subjectTitle}</h3>
                      {displayedBooks.length === 0 ? (
                        <p>No books available for this subject.</p>
                      ) : (
                        <ul>
                          {displayedBooks.map((book, index) => (
                            <li key={index} className="book-item">
                              <img
                                src={`/${book.image}`}
                                alt={`${book.title} cover`}
                                className="book-image"
                                loading="lazy"
                              />
                              <div className="book-info">
                                <p><strong>{book.title}</strong></p>
                                <p>Author: {book.author}</p>
                                <a href={book.source} target="_blank" rel="noopener noreferrer">
                                  View Book
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        className="view-all-books"
                        onClick={() => viewSubjectBooks(subject.sub_id, subjectTitle)}
                        aria-label={`View all books for ${subjectTitle}`}
                      >
                        View All Books
                      </button>
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

export default Library;
