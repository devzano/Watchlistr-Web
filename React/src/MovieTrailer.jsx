import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function MovieTrailers() {
  const { id } = useParams();
  const [movieTitle, setMovieTitle] = useState('');
  const [trailers, setTrailers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

    const fetchTrailers = async (page) => {
      const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&page=${page}`;
      try {
        const { data } = await axios.get(url);
        setTrailers(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetails();
    fetchTrailers(currentPage);
  }, [id, currentPage]);

  const totalPages = Math.ceil(trailers.length / 10);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderTrailers = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;

    return trailers.slice(startIndex, endIndex).map((trailer) => trailer.key && (
      <div key={trailer.id}>
        <h3>{trailer.name}</h3>
        <iframe
          style={{ border: "none" }}
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name}
          allowFullScreen
        ></iframe>
        {/* Add the embedded video URL for each trailer */}
        <iframe
          style={{ border: "none" }}
          width="560"
          height="315"
          src={`https://vidsrc.xyz/embed/movie?tmdb=${id}&sub_url=https%3A%2F%2Fvidsrc.me%2Fsample.srt`}
          title={`Embedded ${trailer.name}`}
          allowFullScreen
        ></iframe>
      </div>
    ));
  };

  return (
    <div className="nav-container">
      {movieTitle ? <h1>{movieTitle} Trailer(s)</h1> : <h1>Loading...</h1>}
      {renderTrailers()}
      <div>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => handlePageClick(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MovieTrailers;
