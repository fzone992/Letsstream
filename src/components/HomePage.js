// src/components/HomePage.js
import React, { useState } from 'react';
import './HomePage.css'; // Import the associated CSS file
import VideoSection from './VideoSection'; // Import the VideoSection component

const HomePage = () => {
  const [mediaType, setMediaType] = useState('series');
  const [seriesId, setSeriesId] = useState('');
  const [episodeNo, setEpisodeNo] = useState('');
  const [season, setSeason] = useState('');
  const [movieId, setMovieId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (you can add logic here)
  };

  const getIframeSrc = () => {
    if (mediaType === 'series') {
      return `https://multiembed.mov/?video_id=${seriesId}&s=${season}&e=${episodeNo}`;
    } else if (mediaType === 'movie') {
      return `https://multiembed.mov/?video_id=${movieId}`;
    }
    return '';
  };
  

  return (
    <div className="home-page-container">
      <div className="form-container">
        <div className="form-section">
          <h2>Welcome to LetsStream!</h2>
          <form onSubmit={handleSubmit}>
            <div className="radio-buttons">
              <input
                type="radio"
                id="series"
                value="series"
                checked={mediaType === 'series'}
                onChange={() => setMediaType('series')}
              />
              <label htmlFor="series">Series</label>

              <input
                type="radio"
                id="movie"
                value="movie"
                checked={mediaType === 'movie'}
                onChange={() => setMediaType('movie')}
              />
              <label htmlFor="movie">Movie</label>
            </div>
            {mediaType === 'series' && (
              <div className="form-fields">
                <label>
                  Series ID:
                  <input
                    type="text"
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Season:
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Episode No.:
                  <input
                    type="text"
                    value={episodeNo}
                    onChange={(e) => setEpisodeNo(e.target.value)}
                  />
                </label>
              </div>
            )}
            {mediaType === 'movie' && (
              <div className="form-fields">
                <label>
                  Movie ID:
                  <input
                    type="text"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                  />
                </label>
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
          
        </div>
      </div>
      <VideoSection getIframeSrc={getIframeSrc} />
    </div>
  );
};

export default HomePage;
