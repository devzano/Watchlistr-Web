import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function EpisodesMedia() {
  const isMobile = window.innerWidth <= 768;
  const { id } = useParams();
  const [tvShowTitle, setTVShowTitle] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);

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

    const fetchEpisodes = async (season) => {
      const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}&language=en-US`;
      try {
        const { data } = await axios.get(url);
        setEpisodes(data.episodes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTVShowDetails();
    fetchEpisodes(currentSeason);
  }, [id, currentSeason]);

  const handleSeasonChange = (season) => {
    setCurrentSeason(season);
  };

  const renderEpisodes = () => {
    return episodes.map((episode) => (
      <div key={episode.id}>
        <h3>{episode.name}</h3>
        <img
          src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
          alt={episode.name}
        />
        <iframe
          style={{ border: 'none' }}
          width={isMobile ? '100%' : '560px'}
          height="315"
          src={`https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${currentSeason}&episode=${episode.episode_number}`}
          title={episode.name}
          allowFullScreen
        ></iframe>
      </div>
    ));
  };

  return (
    <div className="nav-container">
      {tvShowTitle ? <h1>{tvShowTitle}</h1> : <h1>Loading...</h1>}

      <div>
        <h3>{tvShowTitle} - Season {currentSeason} Episodes</h3>
        {renderEpisodes()}
      </div>

      <div>
        <h3>Season Selection</h3>
        <div>
          {Array.from({ length: 10 }).map((_, season) => (
            <button
              key={season}
              onClick={() => handleSeasonChange(season + 1)}
            >
              Season {season + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EpisodesMedia;
