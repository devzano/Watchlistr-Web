import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function TVShowMedia() {
  const isMobile = window.innerWidth <= 768;
  const {id} = useParams();
  const [tvShowTitle, setTVShowTitle] = useState('');

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

    fetchTVShowDetails();
  }, [id]);

  const tvURL = `https://vidsrc.xyz/embed/tv?tmdb=${id}`;

  return (
    <div className="nav-container">
      {tvShowTitle ? <h1>{tvShowTitle}</h1> : <h1>Loading...</h1>}

      <div>
        <h3>{tvShowTitle}</h3>
        <iframe
          style={{border: "none"}}
          width={isMobile ? '100%' : '560px'}
          height="315"
          src={tvURL}
          title={tvShowTitle}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default TVShowMedia;