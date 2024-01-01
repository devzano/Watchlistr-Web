import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShowsContext from './Context';
import { toast } from 'react-toastify';
import './styles/Media.css';

const UpcomingMovies = () => {
  const { movies, loading, addMovieToWatchlist } = useContext(ShowsContext);

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
            <h2 className="header">Upcoming Movies</h2>
            </div>
            <div className="upcoming media-grid-container">
            {movies && movies.length > 0 ? (
              movies.map((movie) => (
                <div className="media-card" key={movie.id}>
                  <div className="media-content">
                    <h3>{movie.title}</h3>
                    <button className="add-to-watchlist-button" onClick={() => { addMovieToWatchlist(movie); toast.success(`${movie.title} added to your watchlist.`, { autoClose: 2000, theme: 'dark' }); }}><i className="fas fa-heart"></i>
                    </button>
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} />
                    <p className="release-date">Release Date: {movie.release_date}</p>
                    <p className="runtime">Runtime: {movie.runtime} mins</p>
                    <p className="genres">Genres: {movie.genres ? movie.genres.map((genre) => genre.name).join(', ') : 'N/A'}</p>
                    <p className="overview">{movie.overview}</p>
                    <Link to={`/movies/${movie.id}`} className="view-media-link">View Media</Link>
                    <Link to={`/movies/${movie.id}/reviews`} className="reviews-link">Reviews</Link>
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

export default UpcomingMovies;