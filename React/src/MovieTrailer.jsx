import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function MovieTrailers() {
  const { id } = useParams();
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
        const response = await axios.get(url);
        setMovieTitle(response.data.title);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMovie = async () => {
      const url = `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
      try {
        const { data } = await axios.get(url);
        setMovie(data.results[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetails();
    fetchMovie();
  }, [id]);

  return (
    <div className="nav-container">
      {movieTitle ? <h1>{movieTitle} movie</h1> : <h1>Loading...</h1>}
      {movie && (
        <div key={movie.id}>
          <h3>{movie.name}</h3>
          <iframe
            style={{ border: "none" }}
            width="560"
            height="315"
            src={`https://vidsrc.xyz/embed/movie?tmdb=${movie.id}`}
            title={movie.name}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
export default MovieTrailers;
