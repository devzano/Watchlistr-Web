import React, {useContext} from 'react';
import ShowsContext from './Context';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import './styles/Navbar.css';
import './styles/LoadingIndicator.css';
import './styles/Titles.css';
import './styles/Poster.css';

const UpcomingMovies = () => {
  const {movies, loading, addMovieToWatchlist} = useContext(ShowsContext);

  return (
    <div className="nav-container">
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
      ) : (
        <div className="upcoming">
          <h2>Upcoming Movies</h2>
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <div className="poster" key={movie.id}>
                <span>
                  <h3>{movie.title}</h3>&nbsp;&nbsp;
                  <button className="button-to-watchlist" onClick={() => {addMovieToWatchlist(movie); toast.success(`${movie.title} added to your watchlist.`, {autoClose: 2000, theme: 'dark'})}} ><i className="fas fa-heart"></i></button>
                  <br/>
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width="300px" alt={movie.title} />
                  ) : (
                    <img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={movie.title}
                    />
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
                  <Link to={`/movies/${movie.id}`} >View Media</Link>
                  <br/>
                  <Link to={`/movies/${movie.id}/reviews`} >Reviews</Link>
                </span>
              </div>
            ))
            ) : (
              <div className="lds-ripple"><div></div><div></div></div>
            )}
          </div>
        )}
      </div>
    );
  };

  export default UpcomingMovies;