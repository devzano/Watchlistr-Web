import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieEmbed = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
        const response = await axios.get(url);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details', error);
      }
    };

    fetchMovieDetails();
  }, [id, apiKey]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-embed-container">
      <h2>{movie.title}</h2>
      <iframe
        src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`}
        width="560"
        height="315"
        frameBorder="0"
        allowFullScreen
        title={movie.title}
      ></iframe>
      {/* Additional movie details can be added here */}
    </div>
  );
};

export default MovieEmbed;
