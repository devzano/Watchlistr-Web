import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './styles/MediaReviews.css'

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function MovieReviews() {
  const {id} = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
        const response = await axios.get(url);
        setMovie(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMovieReviews = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`;
        const response = await axios.get(url);
        setReviews(response.data.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovieDetails();
    fetchMovieReviews();
  }, [id]);

  return (
    <div className="nav-container media-reviews-container">
      {movie ? (
        <div className="media-poster-container">
          <h1>{movie.title} Review(s)</h1>
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={`Poster for ${movie.title}`}
          />
        </div>
      ) : null}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <h3>Author: {review.author}</h3>
            <p>{review.content}</p>
          </div>
        ))
      ) : (
        <p>no reviews for this movie yet</p>
      )}
    </div>
  );
}

export default MovieReviews;