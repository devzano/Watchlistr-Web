import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './styles/MediaReviews.css'

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function TVShowReviews() {
  const {id} = useParams();
  const [tvShow, setTVShow] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`;
        const response = await axios.get(url);
        setTVShow(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTVShowReviews = async () => {
      try {
        const url = `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`;
        const response = await axios.get(url);
        setReviews(response.data.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTVShowDetails();
    fetchTVShowReviews();
  }, [id]);

  return (
    <div className="nav-container media-reviews-container">
      {tvShow ? (
        <div className="media-poster-container">
          <h1>{tvShow.name} Review(s)</h1>
          <img
            src={`https://image.tmdb.org/t/p/original${tvShow.poster_path}`}
            alt={`Poster for ${tvShow.name}`}
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
        <p>no reviews for this TV show yet</p>
      )}
    </div>
  );
}

export default TVShowReviews;