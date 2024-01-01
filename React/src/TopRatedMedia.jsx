import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShowsContext from './Context';
import { toast } from 'react-toastify';
import './styles/Media.css';

const TopRatedMedia = () => {
  const { topMovies, topTvShows, loading, showMedia, toggleMedia, addMovieToWatchlist, addTVShowToWatchlist } = useContext(ShowsContext);

  return (
    <div className="nav-container">
      <div className="media-container">
        {showMedia && (
          <div>
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
              </div>
            ) : (
              <section className="media-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h2 className="header">Top Rated Movies</h2>
                  <button className="toggle-button" onClick={toggleMedia}>
                    {showMedia ? (<i className="fas fa-tv"></i>) : (<i className="fas fa-film"></i>)}
                  </button>
                </div>
                <div className="top-movies media-grid-container">
                {topMovies.map((movie, index) => (
                  <div className="media-card" key={index}>
                    <div className="media-content">
                      <h3>{movie.title}</h3>
                      <button className="add-to-watchlist-button" onClick={() => { addMovieToWatchlist(movie); toast.success(`${movie.title} added to your watchlist.`, { autoClose: 2000, theme: 'dark' }); }}>
                        <i className="fas fa-heart"></i>
                      </button>
                      <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title} />
                      <p className="release-date">Release Date: {movie.release_date}</p>
                      <p className="runtime">Runtime: {movie.runtime} mins</p>
                      <p className="genres">Genres: {movie.genres ? movie.genres.map((genre) => genre.name).join(', ') : 'N/A'}</p>
                      <p className="overview">{movie.overview}</p>
                      <Link to={`/movies/${movie.id}`} className="view-media-link">View Media</Link>
                      <br />
                      <Link to={`/movies/${movie.id}/reviews`} className="reviews-link">Reviews</Link>
                    </div>
                  </div>
                ))}
                </div>
              </section>
            )}
          </div>
        )}
        {!showMedia && (
          <div>
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
              </div>
            ) : (
              <section className="media-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h2 className="header">Top Rated TV Shows</h2>
                  <button className="toggle-button" onClick={toggleMedia}>
                    {showMedia ? (<i className="fas fa-tv"></i>) : (<i className="fas fa-film"></i>)}
                  </button>
                </div>
                <div className="top-tvShows media-grid-container">
                {topTvShows.map((tvShow, index) => (
                  <div className="media-card" key={index}>
                    <div className="media-content">
                      <h3>{tvShow.name}</h3>
                      <button className="add-to-watchlist-button" onClick={() => { addTVShowToWatchlist(tvShow); toast.success(`${tvShow.name} added to your watchlist.`, { autoClose: 2000, theme: 'dark' }); }}>
                        <i className="fas fa-heart"></i>
                      </button>
                      <img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} alt={tvShow.name} />
                      <p className="air-dates">First & Last Air Date: <br />{tvShow.first_air_date} / {tvShow.last_air_date}</p>
                      <p className="runtime">Runtime: {tvShow.episode_run_time[0] ? tvShow.episode_run_time[0] + ' mins' : 'N/A'}</p>
                      <p className="genres">Genres: {tvShow.genres ? tvShow.genres.map((genre) => genre.name).join(', ') : 'N/A'}</p>
                      <p className="overview">{tvShow.overview}</p>
                      <Link className="view-media-link" to={`/tv-shows/${tvShow.id}`}>View Media</Link>
                      <br />
                      <Link to={`/tv-shows/${tvShow.id}/episodes`} className="episodes-link">View Episodes</Link>
                      <br />
                      <Link className="reviews-link" to={`/tv-shows/${tvShow.id}/reviews`}>Reviews</Link>
                    </div>
                  </div>
                ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedMedia;
