import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import './styles/Media.css';

const replitBackendURL = process.env.REACT_APP_REPLIT_BACKEND_URL;

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
      const res = await axios.post(`https://${replitBackendURL}/watchlist/movies`, formData.toString(), config);
      setMovies(res.data);
    }
    catch (error) {
      toast.error('Error Fetching Movies From Watchlist', {autoClose: 2000, theme: 'dark'});
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
      const res = await axios.post(`https://${replitBackendURL}/watchlist/tv`, formData.toString(), config);
      setTVShows(res.data);
    }
    catch (error) {
      toast.error('Error Fetching TV Shows From Watchlist', {autoClose: 2000, theme: 'dark'});
    }
  }

  useEffect(() => {
    // const userId = sessionStorage.getItem('userId');
    fetchMovies()
    fetchTv()
    // eslint-disable-next-line
  }, []);

  const removeFromMovies = (movieId) => {
    setMovies(movies.filter(movie => movie.movieId !== movieId));
  };

  const removeFromTVShows = (tvShowId) => {
    setTVShows(tvShows.filter(tvShow => tvShow.tvShowId !== tvShowId));
  };

  const removeMovieFromWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('username');
    console.log('Removing media', movie.movieId, 'for user', userId);
    try {
      await deleteMovieFromWatchlist(userId, movie.movieId);
      removeFromMovies(movie.movieId);
      toast.success(`Removed the movie, ${movie.title} from your watchlist`, {autoClose: 2000, theme: 'dark'});
    } catch (error) {
      console.error(error);
      toast.error('Error Removing Movie From Watchlist', {autoClose: 2000, theme: 'dark'});
    }
  };

  const removeTVShowFromWatchlist = async (tvShow) => {
    const userId = sessionStorage.getItem('username');
    console.log('Removing media', tvShow.tvShowId, 'for user', userId);
    try {
      await deleteTVShowFromWatchlist(userId, tvShow.tvShowId);
      console.log("Before removal:", tvShows);
      removeFromTVShows(tvShow.tvShowId);
      console.log("After removal:", tvShows);
      toast.success(`Removed the TV Show, ${tvShow.name} from your watchlist`, {autoClose: 2000, theme: 'dark'});
    } catch (error) {
      console.error(error);
      toast.error('Error Removing TV Show From Watchlist', {autoClose: 2000, theme: 'dark'});
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

      const res = await axios.post(`https://${replitBackendURL}/deletemovies`, formData.toString(), config);
      if (res === 'delete') {
        console.log('Movie Removed From Watchlist', movieInternalId);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error Removing Movie From Watchlist', {autoClose: 2000, theme: 'dark'});
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

      const res = await axios.post(`https://${replitBackendURL}/deleteshow`, formData.toString(), config);
      if (res === 'delete') {
        console.log('TV Show Removed From Watchlist', tvShowInternalId);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error Removing TV Show From Watchlist', {autoClose: 2000, theme: 'dark'});
    }
  };

  const toggleMedia = () => {
    isShowingMedia(!showMedia);
  };

  return (
    <div className="nav-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="header" style={{ textTransform: 'capitalize' }}>{username}&apos;s Watchlist</h2>
        <button className="toggle-button" onClick={toggleMedia}>{showMedia ? (<i className="fas fa-tv"></i>) : (<i className="fas fa-film"></i>)}</button>
      </div>
      {showMedia ? (
        <div className="movies media-grid-container">
          {movies.length === 0 ? (
            <p>no movies in watchlist yet!</p>
          ) : (
            movies.map((movie, index) => (
              <div key={`movie-${index}`} className="media-card">
                <div style={{color: 'slateblue'}} className="media-content">
                  <h3>{movie.title}</h3>
                  <button className="button-to-watchlist" onClick={() => removeMovieFromWatchlist(movie)}><i className="fas fa-trash"></i></button>
                  {movie.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`} width='300px' key={movie.title} alt={movie.title} />
                  ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={movie.title} />
                  )} <br/>
                  <p>Release Date: {movie.releaseDate}</p>
                  <p>Runtime: {movie.runtime}mins</p>
                  <p>{movie.overview}</p>
                  <Link className="view-media-link" to={`/movies/${movie.movieId}`}>View Media</Link>
                  <br/>
                  <Link className="reviews-link"to={`/movies/${movie.movieId}/reviews`}>Reviews</Link>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="tvShows media-grid-container">
          {tvShows.length === 0 ? (
            <p>no tv shows in your watchlist yet!</p>
          ) : (
            tvShows.map((tvShow, index) => (
              <div key={`tv-show-${index}`} className="media-card">
                <div style={{color: 'slateblue'}}className="media-content">
                  <h3>{tvShow.name}</h3>
                  <button className="button-to-watchlist" onClick={() => removeTVShowFromWatchlist(tvShow)}><i className="fas fa-trash"></i></button>
                  {tvShow.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/original/${tvShow.posterPath}`} width='300px' key={tvShow.name} alt={tvShow.name} />
                  ) : (
                    <img src='https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg' width='300px' alt={tvShow.name} />
                  )} <br />
                  <p>First & Last Air Dates: <br /> {tvShow.airDates}</p>
                  <p>Runtime: {tvShow.runtime}mins</p>
                  <p>{tvShow.overview}</p>
                  <Link className="view-media-link" to={`/tv-shows/${tvShow.tvShowId}`}>View Media</Link>
                  <Link className="reviews-link" to={`/tv-shows/${tvShow.tvShowId}/reviews`}>Reviews</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;