import {createContext} from 'react';

const ShowsContext = createContext({
  loading: true,
  movies: [],
  tvShows: [],
  // fetchShows: () => {},
  popMovies: [
  ],
  popTvShows: [],
  topMovies: [],
  topTvShows: [],
  // loading: false,
  showMedia: true,
  toggleMedia: () => {},
  addMovieToWatchlist: () => {},
  addTVShowToWatchlist: () => {},
});

export default ShowsContext;