// frontend/src/pages/common/TipsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/TipsPage.css';
import config from '../../config';

const TipsPage = () => {
  const [tips, setTips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // Fetch tips from the API with pagination
  const fetchTips = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiUrl}/tips`, {
        params: { page },
      });
      const newTips = response.data.tips;
      setTips((prevTips) => [...prevTips, ...newTips]);
      setHasMore(newTips.length > 0); // Check if more tips are available
    } catch (error) {
      console.error("Error fetching tips:", error);
      setError("Failed to load tips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips(currentPage);
  }, [currentPage]);

  // Handle infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        !loading &&
        hasMore
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Check if the source is a YouTube URL
  const isYouTubeLink = (url) => {
    return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/');
  };

  // Get the YouTube thumbnail image
  const getYouTubeThumbnail = (url) => {
    const videoId = url.includes('youtu.be/')
      ? url.split('/')[3]
      : url.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Get the YouTube embed URL for video playback
  const getYouTubeEmbedLink = (url) => {
    const videoId = url.includes('youtu.be/')
      ? url.split('/')[3]
      : url.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  // Show video in modal
  const handleVideoClick = (url) => {
    if (isYouTubeLink(url)) {
      const embedUrl = getYouTubeEmbedLink(url);
      setVideoUrl(embedUrl);
      setShowVideo(true);
    }
  };

  // Close the video modal
  const closeModal = () => {
    setShowVideo(false);
    setVideoUrl(null);
  };

  return (
    <div>
      <div className="tips-container">
        <h1>Tips for Learning</h1>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchTips(currentPage)}>Retry</button>
          </div>
        )}

        <div className="tips-grid">
          {tips.map((tip) => (
            <div key={tip.tip_id} className="tip-card">
              <h3>{tip.title}</h3>
              <p><strong>Subject:</strong> {tip.subject_title}</p>
              <p><strong>Instructor:</strong> {tip.full_name}</p>

              {tip.source && isYouTubeLink(tip.source) ? (
                <div className="video-thumbnail" onClick={() => handleVideoClick(tip.source)}>
                  <img
                    src={getYouTubeThumbnail(tip.source)}
                    alt="Video Thumbnail"
                    className="thumbnail"
                  />
                  <div className="play-icon">▶</div>
                </div>
              ) : (
                <p>No video source available.</p>
              )}
            </div>
          ))}
        </div>

        {loading && <div className="loading-spinner">Loading more tips...</div>}

        {showVideo && (
          <div className={`video-modal ${showVideo ? 'show' : ''}`} onClick={closeModal}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>X</button>
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsPage;
