// frontend/src/components/HomeImages.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './css/HomeImages.css';

const HomeImages = ({ homeImages }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleRegisterClick = () => {
    navigate('/student-registration'); // Navigate to StudentRegistration page
  };

  return (
    <section className="hero">
      <div className="carousel">
        {homeImages.map((image) => (
          <img key={image.detail_id} src={image.file_path} alt="Home Carousel" />
        ))}
      </div>
      <div className="welcome-message">
        <h1>
          Getting <span className="highlight">Quality</span> Education Is Now More{' '}
          <span className="highlight">Easy</span>
        </h1>
        <p>
          Provide you with the latest online learning system and materials that help your knowledge grow.
        </p>
        <button className="register-button" onClick={handleRegisterClick}>
          Register Here
        </button>
      </div>
    </section>
  );
};

export default HomeImages;
