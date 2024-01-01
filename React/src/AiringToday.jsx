import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShowsContext from './Context';
import { toast } from 'react-toastify';
import './styles/Media.css';

const AiringToday = () => {
  const { tvShows, loading, addTVShowToWatchlist } = useContext(ShowsContext);

  return (
    <div className="nav-container">
      <div className="media-container">
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <section className="media-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 className="header">TV Shows Airing Today</h2>
            </div>
            <div className="airing-today
            media-grid-container">
              {tvShows && tvShows.length > 0 ? (
                tvShows.map((tvShow) => (
                  <div className="media-card" key={tvShow.id}>
                    <div className="media-content">
                      <h3>{tvShow.name}</h3>
                      <button className="add-to-watchlist-button" onClick={() => { addTVShowToWatchlist(tvShow); toast.success(`${tvShow.name} added to your watchlist.`, { autoClose: 2000, theme: 'dark' }); }}>
                        <i className="fas fa-heart"></i>
                      </button>
                      <img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} />
                      <p className="air-dates">First & Last Air Date: <br />{tvShow.first_air_date} / {tvShow.last_air_date}</p>
                      <p className="runtime">Runtime: {tvShow.episode_run_time ? tvShow.episode_run_time + ' mins' : 'N/A'}</p>
                      <p className="genres">Genres: {tvShow.genres ? tvShow.genres.map((genre) => genre.name).join(', ') : 'N/A'}</p>
                      <p className="overview">{tvShow.overview}</p>
                      <Link to={`/tv-shows/${tvShow.id}`} className="view-media-link">View Media</Link>
                      <Link to={`/tv-shows/${tvShow.id}/episodes`} className="episodes-link">View Episodes</Link>
                      <Link to={`/tv-shows/${tvShow.id}/reviews`} className="reviews-link">Reviews</Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AiringToday;