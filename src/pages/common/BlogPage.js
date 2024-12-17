// frontend/src/pages/common/BlogPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './css/BlogPage.css';
import config from '../../config';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch blogs from API based on the current page
  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    setError(null); // Reset error state on retry
    try {
      const response = await axios.get(`${config.apiUrl}/blogs`, {
        params: { page }
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
    document.title = `Blog Page - Page ${currentPage}`; // Dynamically set page title
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="blog-page">
        <h1>Blog Page</h1>

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => fetchBlogs(currentPage)}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-icon"></div> {/* Visual spinner */}
            <p>Loading...</p>
          </div>
        ) : (
          <div className="blogs-container">
            {blogs.length === 0 ? (
              <p>No blogs available. Check back later!</p>
            ) : (
              blogs.map(blog => (
                <div key={blog.blog_id} className="blog-card">
                  <h2>{blog.title}</h2>

                  {/* Image Block */}
                  <div className="blog-image-container">
                    <img
                      src={`/${blog.image}` || '/path/to/placeholder.jpg'}
                      alt={blog.title}
                      loading="lazy"
                      className="blog-image"
                    />
                  </div>

                  {/* Render content as HTML */}
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  <div className="blog-author">
                    <p>Written by: {blog.full_name}</p>
                  </div>

                  <div className="blog-date">
                    <p>Published on: {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Display only a subset of page numbers if totalPages is large */}
          {Array.from({ length: totalPages })
            .slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            )
            .map((_, index) => {
              const pageIndex = Math.max(0, currentPage - 3) + index + 1;
              return (
                <button
                  key={pageIndex}
                  onClick={() => handlePageChange(pageIndex)}
                  className={currentPage === pageIndex ? 'active' : ''}
                >
                  {pageIndex}
                </button>
              );
            })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
