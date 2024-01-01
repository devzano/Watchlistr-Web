import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function MovieMedia() {
  const isMobile = window.innerWidth <= 768;
  const {id} = useParams();
  const [movieTitle, setMovieTitle] = useState('');

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

    fetchMovieDetails();
  }, [id]);

  const movieURL = `https://vidsrc.xyz/embed/movie?tmdb=${id}`;

  return (
    <div className="nav-container">
      {movieTitle ? <h1>{movieTitle}</h1> : <h1>Loading...</h1>}

      <div>
        <h3>{movieTitle}</h3>
        <iframe
          style={{border: "none"}}
          width={isMobile ? '100%' : '560px'}
          height="315"
          src={movieURL}
          title={movieTitle}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default MovieMedia;
