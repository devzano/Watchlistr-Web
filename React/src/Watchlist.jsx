import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Poster.css';
import './styles/Titles.css';

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [showMedia, isShowingMedia] = useState(true);
  const username = sessionStorage.getItem('username');

  const fetchMovies = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await axios.post('https://watchlistr.rubenizag.repl.co/watchlist/movies', formData.toString(), config);
      setMovies(res.data);
    }
    catch (error) {

    }
  }


  const fetchTv = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await axios.post('https://watchlistr.rubenizag.repl.co/watchlist/tv', formData.toString(), config);
      setTVShows(res.data);
    }
    catch (error) {

    }
  }

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    fetchMovies()
    fetchTv()
  }, []);

  const removeFromMovies = (movieId) => {
    setMovies(movies.filter(movie => movie.movieId !== movieId));
  };

  const removeFromTVShows = (tvShowId) => {
    setTVShows(tvShows.filter(tvShow => tvShow.tv_show_id !== tvShowId));
  };

  const removeMovieFromWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('username');
    console.log('Removing media', movie.movieId, 'for user', userId);
    await deleteMovieFromWatchlist(userId, movie.movieId);
    if (showMedia) {
      removeFromMovies(movie.movieId);
    }
  };
  const removeTVShowFromWatchlist = async (tvShow) => {
    const userId = sessionStorage.getItem('username');
    console.log('Removing media', tvShow.tvShowId, 'for user', userId);
    await deleteTVShowFromWatchlist(userId, tvShow.tvShowId);
    if (!showMedia) {
      removeFromTVShows(tvShow.tv_show_id);
    }
  };

  const deleteMovieFromWatchlist = async (userId, movieInternalId) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', userId);
      formData.append('movieid', movieInternalId)

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await axios.post('https://watchlistr.rubenizag.repl.co/deletemovies', formData.toString(), config);
      if (res === 'delete') {
        console.log('Media Removed From Watchlist', movieInternalId);
      }
    } catch (err) {
      console.error(err);
      console.log('Error Removing Media From Watchlist');
    }
  };
  const deleteTVShowFromWatchlist = async (userId, tvShowInternalId) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', userId);
      formData.append('tvShowid', tvShowInternalId)

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await axios.post('https://watchlistr.rubenizag.repl.co/deleteshow', formData.toString(), config);
      if (res === 'delete') {
        console.log('Media Removed From Watchlist', tvShowInternalId);
      }
    } catch (err) {
      console.error(err);
      console.log('Error Removing Media From Watchlist');
    }
  };

  const toggleMedia = () => {
    isShowingMedia(!showMedia);
  };

  return (
    <div className="nav-container watchlist">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ textTransform: 'capitalize' }}>{username}&apos;s Watchlist</h2>
        <button onClick={toggleMedia} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>{showMedia ? (<i className="fas fa-tv"></i>) : (<i className="fas fa-film"></i>)}</button>
      </div>
      {showMedia ? (
        <div>
          {movies.length === 0 ? (
            <p>no movies in watchlist yet!</p>
          ) : (
            movies.map((movie, index) => (
              <div key={`movie-${index}`} className="poster">
                <span>
                  <h3>{movie.title}</h3>
                  <button className="button-to-watchlist" onClick={() => removeMovieFromWatchlist(movie)} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}><i className="fas fa-trash"></i></button>
                  {movie.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`} width='300px' key={movie.title} alt={movie.title} />
                  ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={movie.title} />
                  )} <br />
                  <p>Release Date: {movie.releaseDate}</p>
                  <p>Runtime: {movie.runtime}mins</p>
                  <p>{movie.overview}</p>
                  <Link to={`/movies/${movie.movieId}`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>View Trailers</Link>
                  <Link to={`/movies/${movie.movieId}/reviews`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>Reviews</Link>
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {tvShows.length === 0 ? (
            <p>no tv shows in your watchlist yet!</p>
          ) : (
            tvShows.map((tvShow, index) => (
              <div key={`tv-show-${index}`} className="poster">
                <span>
                  <h2>{tvShow.name}</h2>
                  <button className="button-to-watchlist" onClick={() => removeTVShowFromWatchlist(tvShow)} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}><i className="fas fa-trash"></i></button>
                  {tvShow.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/original/${tvShow.posterPath}`} width='300px' key={tvShow.name} alt={tvShow.name} />
                  ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={tvShow.title} />
                  )} <br />
                  <p>First & Last Air Dates: <br /> {tvShow.airDates}</p>
                  <p>Runtime: {tvShow.runtime}mins</p>
                  <p>{tvShow.overview}</p>
                  <Link to={`/tv-shows/${tvShow.tvShowId}`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>View Trailers</Link>
                  <Link to={`/tv-shows/${tvShow.tvShowId}/reviews`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>Reviews</Link>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;