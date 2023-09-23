import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import ShowsContext from './Context';
import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://api.themoviedb.org/3';
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

  const fetchDataFromTMDb = async (endpoint, params = {}) => {
    params['api_key'] = apiKey;
    params['language'] = 'en-US';
    const url = `${API_BASE_URL}/${endpoint}`;
    return axios.get(url, {params});
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const airingToday = await fetchDataFromTMDb('tv/airing_today', {page: 1});
    setTVShows(airingToday.data.results);
    const upcomingMovies = await fetchDataFromTMDb('movie/upcoming', {page: 1});
    setMovies(upcomingMovies.data.results);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    const fetchPopularMedia = async () => {
      try {
        setLoading(true);
        const [popMoviesRes, popTvShowsRes] = await Promise.all([
          fetchDataFromTMDb('movie/popular', {page: 1}),
          fetchDataFromTMDb('tv/popular', {page: 1})
        ]);
        setPopMovies(popMoviesRes.data.results);
        setPopTvShows(popTvShowsRes.data.results);
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchPopularMedia();
  }, []);

  useEffect(() => {
    const fetchTopRatedMedia = async () => {
      try {
        setLoading(true);
        const [topMoviesRes, topTvShowsRes] = await Promise.all([
          fetchDataFromTMDb('movie/top_rated', {page: 1}),
          fetchDataFromTMDb('tv/top_rated', {page: 1})
        ]);
        setTopMovies(topMoviesRes.data.results);
        setTopTvShows(topTvShowsRes.data.results);
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchTopRatedMedia();
  }, []);

  const handleApiError = (_error) => {
    toast.error('An error occurred. Please try again later.', {autoClose: 2000, theme: 'dark'});
    setLoading(false);
  };

  const addToWatchlist = async (item, type) => {
    const userId = sessionStorage.getItem('username');
    if (!userId) {
      toast.info(`Login to add ${type} to your Watchlist`, {autoClose: 2000, theme: 'dark'});
      return;
    }

    const formData = new URLSearchParams();
    formData.append(`${type}Id`, item.id);
    formData.append('title', item.title || item.name);
    formData.append('posterPath', item.poster_path);
    formData.append('overview', item.overview);
    formData.append('userId', userId);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    try {
      const response = await axios.post(`https://${replitBackendURL}/user-watchlist-${type}`, formData.toString(), config);
      if (response.data === 'success') {
        console.log(`${item.title || item.name} added to watchlist!`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const addMovieToWatchlist = (movie) => addToWatchlist(movie, 'movie');
  const addTVShowToWatchlist = (tvShow) => addToWatchlist(tvShow, 'tv');

  const toggleMedia = () => {
    setShowMedia(!showMedia);
  };

  return (
    <ShowsContext.Provider value={{movies, tvShows, loading, popMovies, popTvShows, topMovies, topTvShows, showMedia, toggleMedia, addMovieToWatchlist, addTVShowToWatchlist, fetchMedia}}>
      {children}
    </ShowsContext.Provider>
  );
};

ShowsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ShowsProvider;