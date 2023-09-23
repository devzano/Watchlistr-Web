import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function TVShowTrailers() {
  const {id} = useParams();
  const [tvShowTitle, setTVShowTitle] = useState('');
  const [trailers, setTrailers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`;
        const response = await axios.get(url);
        setTVShowTitle(response.data.name);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTrailers = async (page) => {
      const url = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&page=${page}`;
      try {
        const {data} = await axios.get(url);
        setTrailers(data.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTVShowDetails();
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
          style={{border: "none"}}
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name}
          allowFullScreen
        ></iframe>
      </div>
    ));
  };

  return (
    <div className="nav-container">
      {tvShowTitle ? <h1>{tvShowTitle} Trailer(s)</h1> : <h1>Loading...</h1>}
      {renderTrailers()}
      <div>
        {Array.from({length: totalPages}).map((_, index) => (
          <button key={index} onClick={() => handlePageClick(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TVShowTrailers;