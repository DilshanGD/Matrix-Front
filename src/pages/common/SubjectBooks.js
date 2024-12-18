import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import './css/Library.css';
import config from '../../config';

const SubjectBooks = () => {
  const { subtitle } = useParams();
  const [searchParams] = useSearchParams();
  const sub_id = searchParams.get('sub_id');

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const fetchBooksForSubject = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${config.apiUrl}/library/subject/${subtitle}`, {
        params: { sub_id, page, limit },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subject books:', err);
      setError('Failed to load books for this subject');
      setLoading(false);
    }
  }, [subtitle, sub_id, limit]);

  useEffect(() => {
    fetchBooksForSubject(currentPage);
  }, [fetchBooksForSubject, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="library-container">
      <div className="library-content">
        <h1>Books for Subject: {subtitle}</h1>
        <ul>
          {books.map((book, index) => (
            <li key={index} className="book-item">
              <img src={`/${book.image}`} alt={`${book.title}'s cover`} className="book-image" />
              <div className="book-info">
                <p><strong>{book.title}</strong></p>
                <p>Author: {book.author}</p>
                <p>Created on: {formatDate(book.createdAt)}</p>
                <a href={book.source} target="_blank" rel="noopener noreferrer">View Book</a>
              </div>
            </li>
          ))}
        </ul>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectBooks;
