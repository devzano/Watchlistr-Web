import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import './styles/Poster.css';
import './styles/LoadingIndicator.css'
import './styles/MediaSearch.css';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const renderBackendURL = process.env.REACT_APP_REPLIT_BACKEND_URL;

const MediaSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showTVShowForm, setShowTVShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const search = async (searchType, urlModifier) => {
    try {
      setLoading(true);
      const searchUrl = `https://api.themoviedb.org/3/search/${searchType}?api_key=${apiKey}&query=${query}&page=`;
      const { data: searchResults } = await axios.get(`${searchUrl}1`);
      const totalPages = searchResults.total_pages;
      const details = [];

      for (let page = 1; page <= totalPages; page++) {
        const { data: pageResults } = await axios.get(`${searchUrl}${page}${urlModifier}`);
        const ids = pageResults.results.map(item => item.id);
        const detailsPromises = ids.map(id => {
          const itemUrl = `https://api.themoviedb.org/3/${searchType}/${id}?api_key=${apiKey}&language=en-US`;
          return axios.get(itemUrl).catch(() => ({ data: { id, title: "Unknown", name: "Unknown", poster_path: null } }));
        });
        const detailsResponses = await Promise.all(detailsPromises);
        const pageDetails = detailsResponses.map(response => response.data);
        details.push(...pageDetails);
      }
      if (searchType === "movie") {
        setMovies(details);
      } else if (searchType === "tv") {
        setTVShows(details);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      const errorMessage = searchType === "movie" ? "An Error Occurred While Searching For Movies. Please Try Again Later." : "An Error Occurred While Searching For TV Shows. Please Try Again Later.";
      alert(errorMessage);
      setLoading(false);
    }
  };

  const searchMovies = (e) => {
    e.preventDefault();
    search("movie", "");
  };

  const searchTVShows = (e) => {
    e.preventDefault();
    search("tv", "");
  };

  // Add Movie To Watchlist
  const addMovieToWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('username');
    if (!userId) {
      toast.info('Login to add movies to your Watchlist', {autoClose: 2000, theme: 'dark'});
      return;
    }
    try {
      const formData = new URLSearchParams();
      formData.append('movieId', movie.id);
      formData.append('title', movie.title);
      formData.append('releaseDate', movie.release_date);
      formData.append('runtime', movie.runtime);
      formData.append('posterPath', movie.poster_path);
      formData.append('overview', movie.overview);
      formData.append('userId', userId);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const response = await axios.post(`https://${renderBackendURL}/user-watchlist-movie`, formData.toString(), config);
      if (response === 'success') {

        console.log(`${movie.title} added to watchlist!`);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display the error message from the server
        toast.error(error.response.data.message, { autoClose: 2000, theme: 'dark' });
      } else {
        // If the error response does not contain a specific message, display a generic error message
        toast.error('Error adding movie to watchlist. Please try again later.', { autoClose: 2000, theme: 'dark' });
      }
    }
  };

  // Add TV Show To Watchlist
  const addTVShowToWatchlist = async (tvShow) => {
    const userId = sessionStorage.getItem('username');
    const firstAirDate = tvShow.first_air_date;
    const lastAirDate = tvShow.last_air_date;
    const airDates = firstAirDate + '/' + lastAirDate;
    if (!userId) {
      toast.info('Login to add TV Shows to your Watchlist', { autoClose: 2000, theme: 'dark' });
      return;
    }
    try {
      const formData = new URLSearchParams();
      formData.append('tvShowId', tvShow.id);
      formData.append('name', tvShow.name);
      formData.append('airDates', airDates);
      formData.append('runtime', tvShow.episode_run_time[0]);
      formData.append('posterPath', tvShow.poster_path);
      formData.append('overview', tvShow.overview);
      formData.append('userId', userId);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const response = await axios.post(`https://${renderBackendURL}/user-watchlist-tv`, formData.toString(), config);
      if (response === 'success') {
        console.log(`${tvShow.name} added to Watchlist!`);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display the error message from the server
        toast.error(error.response.data.message, { autoClose: 2000, theme: 'dark' });
      } else {
        // If the error response does not contain a specific message, display a generic error message
        toast.error('Error adding tv show to watchlist. Please try again later.', { autoClose: 2000, theme: 'dark' });
      }
    }
  };

  const renderMovies = () => {
    const moviesPerPage = 18;
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const currentMovies = movies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
    return (
      <div>
        <h2>Search Results</h2>
        {currentMovies.map((movie) => (
          <div className="poster" key={movie.id}>
            <span>
              <h3>{movie.title}</h3>
              <button className="button-to-watchlist" onClick={() => {addMovieToWatchlist(movie); toast.success(`${movie.title} added to your watchlist.`, {autoClose: 2000, theme: 'dark'})}}><i className="fas fa-heart"></i></button>
              <br/>
              {movie.poster_path ? (<img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} width="300px" alt={movie.title} />
              ) : (<img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={movie.title}/>
              )}
              <br/>
              <p>Release Date: {movie.release_date}</p>
              <p>Runtime: {movie.runtime}mins</p>
              <p>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</p>
              <p>{movie.overview}</p>
              <Link className="view-media-link" to={`/movies/${movie.id}`}>View Media</Link>
              <br/>
              <Link className="reviews-link" to={`/movies/${movie.id}/reviews`}>Reviews</Link>
            </span>
          </div>
        ))}
        {totalPages > 1 && <div className="pagination">
            {Array.from({length: totalPages}).map((_, index) => (
              <button key={index} onClick={() => handlePageClick(index + 1)}>{index + 1}</button>
            ))}
          </div>
        }
        </div>
      );
  };
  const renderTVShows = () => {
    const tvShowsPerPage = 18;
    const startIndex = (currentPage - 1) * tvShowsPerPage;
    const endIndex = startIndex + tvShowsPerPage;
    const currentTVShows = tvShows.slice(startIndex, endIndex);
    const totalPages = Math.ceil(tvShows.length / tvShowsPerPage);
    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
    return (
      <div className="media-search">
        <h2>Search Results</h2>
        {currentTVShows.map((tvShow) => (
          <div className="poster" key={tvShow.id}>
            <span>
              <h2>{tvShow.name}</h2>
              <button className="button-to-watchlist" onClick={() => {addTVShowToWatchlist(tvShow); toast.success(`${tvShow.name} added to your watchlist.`, {autoClose: 2000, theme: 'dark'})}}><i className="fas fa-heart"></i></button>
              <br />
              {tvShow.poster_path ? (<img src={`https://image.tmdb.org/t/p/original/${tvShow.poster_path}`} width="300px" alt={tvShow.name} />
              ) : (<img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={tvShow.name}/>
              )}
              <br/>
              <p>First & Last Air Date: {tvShow.first_air_date} / {tvShow.last_air_date}</p>
              <p>Runtime: {tvShow.episode_run_time[0]}mins</p>
              <p>Genres: {tvShow.genres.map((genre) => genre.name).join(', ')}</p>
              <p>{tvShow.overview}</p>
              <Link className="view-media-link" to={`/tv-shows/${tvShow.id}`}>View Trailers</Link>
              <br/>
              <Link className="view-media-link" to={`/tv-shows/${tvShow.id}/episodes`}>View Episodes</Link>
              <br/>
              <Link className="reviews-link"to={`/tv-shows/${tvShow.id}/reviews`}>Reviews</Link>
            </span>
          </div>
        ))}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({length: totalPages}).map((_, index) => (
              <button key={index} onClick={() => handlePageClick(index + 1)}>{index + 1}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleMovieForm = () => {
    setShowMovieForm(!showMovieForm);
    setShowTVShowForm(false);
    setQuery('')
  };

  const toggleTVShowForm = () => {
    setShowTVShowForm(!showTVShowForm);
    setShowMovieForm(false);
    setQuery('')
  };

  return (
    <div className="nav-container">
      <button onClick={toggleMovieForm}>Movie Search</button>
      <button onClick={toggleTVShowForm}>TV Show Search</button>
  {showMovieForm && (
    <form className="media-search" onSubmit={searchMovies} style={{ boxShadow: "none" }}>
      <input type="text" id="query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="movie title"/>
      <button type="submit">Search</button>
      <div>
        {loading ? <div className="lds-ripple"><div></div><div></div></div> : renderMovies()}
      </div>
    </form>
  )}
  {showTVShowForm && (
    <form className="media-search" onSubmit={searchTVShows} style={{ boxShadow: "none" }}>
      <input type="text" id="query" value={query}onChange={(e) => setQuery(e.target.value)} placeholder="tv show name"/>
      <button>Search</button>
      <div>
        {loading ? <div className="lds-ripple"><div></div><div></div></div> : renderTVShows()}
      </div>
    </form>
  )}
    </div>
  );
};

export default MediaSearch;