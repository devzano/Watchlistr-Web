import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import ShowsContext from './Context';
import {ToastContainer} from 'react-toastify';
import './styles/LoadingIndicator.css';
import './styles/Titles.css';
import './styles/Poster.css';

const TopRatedMedia = () => {
  const {topMovies, topTvShows, loading, showMedia, toggleMedia, addMovieToWatchlist, addTVShowToWatchlist} = useContext(ShowsContext);

  return (
    <div className="nav-container">
      {showMedia && (
          <div>
        {loading ? (
          <div className="lds-ripple"><div></div><div></div></div>
        ) : (
          <section className="top-movies">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <h2>Top Rated Movies</h2>
              <button onClick={toggleMedia} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>{showMedia ? (<i className="fas fa-tv"></i>) : (<i className="fas fa-film"></i>)}</button>
            </div>
            <ToastContainer/>
            {topMovies.map((movie, index) => (
              <div className="poster" key={index}>
                <span>
                  <h3>{movie.title}</h3>&nbsp;&nbsp;
                  <button className="button-to-watchlist" onClick={() => addMovieToWatchlist(movie)} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}><i className="fas fa-heart"></i></button>
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width='300px' alt={movie.title}/>
                    ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={movie.title}/>
                  )}
                  <br/>
                  <p>Release Date: {movie.release_date}</p>
                  <p>Runtime: {movie.runtime}mins</p>
                  {movie.genres ? (
                    <p>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</p>
                  ) : (
                    <p>Genres: Unknown</p>
                  )}
                  <p>{movie.overview}</p>
                  <Link to={`/movies/${movie.id}`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>View Trailers</Link>
                  <br/>
                  <Link to={`/movies/${movie.id}/reviews`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>Reviews</Link>
                </span>
              </div>
            ))}
          </section>
        )}
        </div>
      )}
      {!showMedia && (
        <div>
          {loading ? (
            <div className="lds-ripple"><div></div><div></div></div>
          ) : (
            <section className="top-tvshows">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h2>Top Rated TV Shows</h2>
                <button onClick={toggleMedia} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>{showMedia ? (<i className="fas fa-tv"></i>) : (<i className="fas fa-film"></i>)}</button>
              </div>
              <ToastContainer/>
              {topTvShows.map((tvShow, index) => (
                <div className="poster" key={index}>
                  <span>
                    <h3>{tvShow.name}</h3>&nbsp;&nbsp;
                    <button className="button-to-watchlist" onClick={() => addTVShowToWatchlist(tvShow)} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}><i className="fas fa-heart"></i></button>
                    {tvShow.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} width='300px' alt={tvShow.name}/>
                      ) : (
                      <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={tvShow.name}/>
                    )}
                    <br/>
                    <p>First & Last Air Date: <br/> {tvShow.first_air_date} / {tvShow.last_air_date}</p>
                    {tvShow.episode_run_time[0] ? (
                      <p>Runtime: {tvShow.episode_run_time[0]}mins</p>
                    ) : tvShow.last_episode_to_air && tvShow.last_episode_to_air.runtime ? (
                      <p>Runtime: {tvShow.last_episode_to_air.runtime}mins</p>
                    ) : (
                      <p>Runtime: N/A</p>
                    )}
                    {tvShow.genres ? (
                      <p>Genres: {tvShow.genres.map((genre) => genre.name).join(', ')}</p>
                    ) : (
                      <p>Genres: N/A</p>
                    )}
                    <p>{tvShow.overview}</p>
                    <Link to={`/tv-shows/${tvShow.id}`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>View Trailers</Link>
                    <br/>
                    <Link to={`/tv-shows/${tvShow.id}/reviews`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>Reviews</Link>
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default TopRatedMedia;