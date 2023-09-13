import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ShowsContext from './Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiKey = process.env.REACT_APP_TMDB_API_KEY;

const ShowsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [tvShows, setTVShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [popMovies, setPopMovies] = useState([]);
  const [popTvShows, setPopTvShows] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);
  const [showMedia, setShowMedia] = useState(true);

  const fetchMedia = async () => {
    setLoading(true);

    // Fetch Airing Today TV Shows
    const airingToday = [];
    let page = 1;
    let totalPages = 1;
    do {
      const res = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&region=US&page=${page}`);
      const filteredShows = res.data.results.filter((tvShow) => tvShow.original_language === 'en' && tvShow.origin_country.includes('US'));
      airingToday.push(...filteredShows);
      totalPages = res.data.total_pages;
      page++;
    } while (page <= totalPages);
    const airingTodayDetailsPromises = airingToday.map((tvShow) => {
      const tvShowUrl = `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&with_original_language=en&with_origin_country=US`;
      return axios.get(tvShowUrl);
    });
    const airingTodayDetailsResponses = await Promise.all(airingTodayDetailsPromises);
    const airingTodayDetails = airingTodayDetailsResponses.map((res) => res.data);

    // Fetch Upcoming Movies
    const upcomingMoviesPromises = Array.from({ length: 10 }, (_, i) => axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${i + 1}&region=US`));
    const upcomingMoviesResponses = await Promise.all(upcomingMoviesPromises);
    const upcomingMovies = upcomingMoviesResponses.flatMap(res => res.data.results);
    const upcomingMoviesDetailsPromises = upcomingMovies.map((movie) => {
      const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
      return axios.get(movieUrl);
    });
    const upcomingMoviesDetailsResponses = await Promise.all(upcomingMoviesDetailsPromises);
    const upcomingMoviesDetails = upcomingMoviesDetailsResponses.map((res) => res.data);
    setTVShows(airingTodayDetails);
    setMovies(upcomingMoviesDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Fetch Popular Media
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popMoviesRes, popTvShowsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=1`),
          axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&page=1`),
        ]);
        const popMovies = popMoviesRes.data.results;
        const popTvShows = popTvShowsRes.data.results;
        for (let i = 2; i <= 10; i++) {
          const [moviesRes, tvShowsRes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=${i}`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&page=${i}`),
          ]);
          popMovies.push(...moviesRes.data.results);
          popTvShows.push(...tvShowsRes.data.results);
        }
        const movieDetailsPromises = popMovies.map((movie) => {
          const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
          return axios.get(movieUrl);
        });
        const tvShowDetailsPromises = popTvShows.map((tvShow) => {
          const tvShowUrl = `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&with_original_language=en&with_origin_country=US`;
          return axios.get(tvShowUrl);
        });
        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const tvShowDetailsResponses = await Promise.all(tvShowDetailsPromises);
        const movieDetails = movieDetailsResponses.map((res) => res.data);
        const tvShowDetails = tvShowDetailsResponses.map((res) => res.data);
        setPopMovies(movieDetails);
        setPopTvShows(tvShowDetails);
        setLoading(false);
      } catch (error) {
        toast.error('An error occurred while fetching Popular Movies and TV Shows. Please try again later.', { autoClose: 2000, theme: 'dark' });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Top-Rated Media
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [topMoviesRes, topTvShowsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&region=US`),
          axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&region=US`),
        ]);
        const topMovies = topMoviesRes.data.results;
        const topTvShows = topTvShowsRes.data.results;
        for (let i = 2; i <= 10; i++) {
          const [moviesRes, tvShowsRes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=${i}`),
            axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&region=US&page=${i}`),
          ]);
          topMovies.push(...moviesRes.data.results);
          topTvShows.push(...tvShowsRes.data.results);
        }
        const movieDetailsPromises = topMovies.map((movie) => {
          const movieUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
          return axios.get(movieUrl);
        });
        const tvShowDetailsPromises = topTvShows.map((tvShow) => {
          const tvShowUrl = `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&language=en-US&with_original_language=en&with_origin_country=US&region=US`;
          return axios.get(tvShowUrl);
        });
        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const tvShowDetailsResponses = await Promise.all(tvShowDetailsPromises);
        const movieDetails = movieDetailsResponses.map((res) => res.data);
        const tvShowDetails = tvShowDetailsResponses.map((res) => res.data);
        setTopMovies(movieDetails);
        setTopTvShows(tvShowDetails);
        setLoading(false);
      } catch (error) {
        toast.error('An error occurred while fetching Top Rated Movies and TV Shows. Please try again later.', { autoClose: 2000, theme: 'dark' });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add Movie To Watchlist
  const addMovieToWatchlist = async (movie) => {
    const userId = sessionStorage.getItem('username');
    if (!userId) {
      toast.info('Login to add movies to your Watchlist', { autoClose: 2000, theme: 'dark' });
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

      const response = await axios.post('https://watchlistr.rubenizag.repl.co/user-watchlist-movie', formData.toString(), config);
      if (response === 'success') {

        toast.success(`${movie.title} added to watchlist!`, { autoClose: 2000, theme: 'dark' });
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

      const response = await axios.post('https://watchlistr.rubenizag.repl.co/user-watchlist-tv', formData.toString(), config);
      if (response === 'success') {
        toast.success(`${tvShow.name} added to Watchlist!`, { autoClose: 2000, theme: 'dark' });
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

  // Toggle Between Movie & TV Show
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