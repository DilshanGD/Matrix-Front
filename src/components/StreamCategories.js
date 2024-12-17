// frontend/src/components/CategoriesSection.js

import React from 'react';
import './css/StreamCategories.css';

const StreamCategories = ({ streams }) => (
  <section className="categories">
    <h2>Explore Courses by Category.</h2>
    <div className="category-cards">
      {streams.map((stream) => (
        <div key={stream.stream_id} className="category-card">
          <span className="category-title">{stream.title}</span>
          <p>100+ Students</p> {/* Adjust if you have specific counts */}
        </div>
      ))}
    </div>
  </section>
);

export default StreamCategories;
