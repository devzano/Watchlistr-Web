import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import ShowsContext from './Context';
import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const replitBackendURL = process.env.REACT_APP_REPLIT_BACKEND_URL;

const ShowsProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [tvShows, setTVShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [popMovies, setPopMovies] = useState([]);
  const [popTvShows, setPopTvShows] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);
  const [showMedia, setShowMedia] = useState(true);
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const fetchAUMedia = useCallback(async () => {
    setLoading(true);
    const airingToday = [];
    let page = 1;
    const MAX_PAGES = 5;
    let totalPages = 1;

    while (page <= totalPages && page <= MAX_PAGES) {
      const res = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&region=US&page=${page}`);
      const filteredShows = res.data.results.filter((tvShow) => tvShow.original_language === 'en' && tvShow.origin_country.includes('US'));
      airingToday.push(...filteredShows);
      totalPages = res.data.total_pages;
      page++;

      if (page <= totalPages && page <= MAX_PAGES) {
        await delay(2000);
      }
    }

    const airingTodayDetailsPromises = airingToday.map((tvShow) => {
      const tvShowUrl = `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&with_original_language=en&with_origin_country=US`;
      return axios.get(tvShowUrl);
    });
    const airingTodayDetailsResponses = await Promise.all(airingTodayDetailsPromises);
    const airingTodayDetails = airingTodayDetailsResponses.map((res) => res.data);

    // Fetch Upcoming Movies
    const upcomingMovies = [];
    page = 1;
    totalPages = 1;

    while (page <= totalPages && page <= MAX_PAGES) {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}&region=US`);
      upcomingMovies.push(...res.data.results);
      totalPages = res.data.total_pages;
      page++;

      if (page <= totalPages && page <= MAX_PAGES) {
        await delay(2000);
      }
    }

    const upcomingMoviesDetailsPromises = upcomingMovies.map((movie) => {
      const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
      return axios.get(movieUrl);
    });
    const upcomingMoviesDetailsResponses = await Promise.all(upcomingMoviesDetailsPromises);
    const upcomingMoviesDetails = upcomingMoviesDetailsResponses.map((res) => res.data);

    setTVShows(airingTodayDetails);
    setMovies(upcomingMoviesDetails);
    setLoading(false);
  }, []);

useEffect(() => {
    fetchAUMedia();
}, [fetchAUMedia]);

const MAX_PAGES = 5;

const fetchMedia = async (type, setMoviesFunction, setTvShowsFunction) => {
  try {
    setLoading(true);
    const movieEndpoint = type === 'popular' ? 'movie/popular' : 'movie/top_rated';
    const tvEndpoint = type === 'popular' ? 'tv/popular' : 'tv/top_rated';
    const [initialMoviesRes, initialTvShowsRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/${movieEndpoint}?api_key=${apiKey}&language=en-US&region=US&page=1`),
      axios.get(`https://api.themoviedb.org/3/${tvEndpoint}?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&page=1`),
    ]);
    let movies = initialMoviesRes.data.results;
    let tvShows = initialTvShowsRes.data.results;
    for (let i = 2; i <= MAX_PAGES; i++) {
      const [moviesRes, tvShowsRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/${movieEndpoint}?api_key=${apiKey}&language=en-US&region=US&page=${i}`),
        axios.get(`https://api.themoviedb.org/3/${tvEndpoint}?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&page=${i}`),
      ]);
      movies.push(...moviesRes.data.results);
      tvShows.push(...tvShowsRes.data.results);
    }
    const movieDetailsPromises = movies.map(movie => axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`));
    const tvShowDetailsPromises = tvShows.map(tvShow => axios.get(`https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&region=US`));
    const movieDetailsResponses = await Promise.all(movieDetailsPromises);
    const tvShowDetailsResponses = await Promise.all(tvShowDetailsPromises);
    const movieDetails = movieDetailsResponses.map(res => res.data);
    const tvShowDetails = tvShowDetailsResponses.map(res => res.data);
    setMoviesFunction(movieDetails);
    setTvShowsFunction(tvShowDetails);
    setLoading(false);
  } catch (error) {
    const errorMsg = `An error occurred while fetching ${type === 'popular' ? 'Popular' : 'Top Rated'} Movies and TV Shows. Please try again later.`;
    toast.error(errorMsg, { autoClose: 2000, theme: 'dark' });
    setLoading(false);
  }
};

useEffect(() => {
  fetchMedia('popular', setPopMovies, setPopTvShows);
}, []);

useEffect(() => {
  fetchMedia('top_rated', setTopMovies, setTopTvShows);
}, []);

  const addItemToWatchlist = async (item, type) => {
    const userId = sessionStorage.getItem('username');
    let endpoint, logMessage, toastInfoMessage;
    const formData = new URLSearchParams();
    if (type === 'movie') {
      formData.append('movieId', item.id);
      formData.append('title', item.title);
      formData.append('releaseDate', item.release_date);
      formData.append('runtime', item.runtime);
      formData.append('posterPath', item.poster_path);
      formData.append('overview', item.overview);
      endpoint = '/user-watchlist-movie';
      logMessage = `${item.title} added to watchlist!`;
      toastInfoMessage = 'Login to add movies to your Watchlist';
    } else if (type === 'tvShow') {
      const airDates = `${item.first_air_date}/${item.last_air_date}`;
      formData.append('tvShowId', item.id);
      formData.append('name', item.name);
      formData.append('airDates', airDates);
      formData.append('runtime', item.episode_run_time[0]);
      formData.append('posterPath', item.poster_path);
      formData.append('overview', item.overview);
      endpoint = '/user-watchlist-tv';
      logMessage = `${item.name} added to Watchlist!`;
      toastInfoMessage = 'Login to add TV Shows to your Watchlist';
    }

    if (!userId) {
      toast.info(toastInfoMessage, { autoClose: 2000, theme: 'dark' });
      return;
    }

    formData.append('userId', userId);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      const response = await axios.post(`https://${replitBackendURL}${endpoint}`, formData.toString(), config);
      if (response === 'success') {
        console.log(logMessage);
      }
    } catch (error) {
      let errorMessage = `Error adding ${type} to watchlist. Please try again later.`;
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, { autoClose: 2000, theme: 'dark' });
    }
  };

  const addMovieToWatchlist = async (movie) => {
    addItemToWatchlist(movie, 'movie');
  };

  const addTVShowToWatchlist = async (tvShow) => {
    addItemToWatchlist(tvShow, 'tvShow');
  };

  const toggleMedia = () => {
    setShowMedia(!showMedia);
  };

  return (
    <ShowsContext.Provider value={{ movies, tvShows, loading, popMovies, popTvShows, topMovies, topTvShows, showMedia, toggleMedia, addMovieToWatchlist, addTVShowToWatchlist, fetchMedia }}>
      {children}
    </ShowsContext.Provider>
  );
};

ShowsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShowsProvider;