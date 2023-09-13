import React, {useContext} from 'react';
import ShowsContext from './Context';
import {Link} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import './styles/Navbar.css';
import './styles/LoadingIndicator.css';
import './styles/Titles.css';
import './styles/Poster.css';

const AiringToday = () => {
  const {tvShows, loading, addTVShowToWatchlist} = useContext(ShowsContext);

  return (
    <div className="nav-container">
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
      ) : (
        <div className="airing-today">
          <ToastContainer/>
          <h2>TV Shows Airing Today</h2>
          {tvShows.map((tvShow) => (
            <div className="poster" key={tvShow.id}>
              <span>
                <h3>{tvShow.name}</h3>
                <button className="button-to-watchlist" onClick={() => addTVShowToWatchlist(tvShow)} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}><i className="fas fa-heart"></i></button>
                {tvShow.poster_path ? (<img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} width="300px" alt={tvShow.name}/>
                ) : (<img src="https://static.displate.com/857x1200/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg" width="300px" alt={tvShow.name}/>
                )}
                <p>First & Last Air Date: <br/> {tvShow.first_air_date} / {tvShow.last_air_date}</p>
                {tvShow.episode_run_time ? (
                  <p>Runtime: {tvShow.episode_run_time}mins</p>
                ) : tvShow.last_episode_to_air && tvShow.last_episode_to_air.runtime ? (
                  <p>Runtime: {tvShow.last_episode_to_air.runtime}mins</p>
                ) : (
                  <p>Runtime: N/A</p>
                )}
                {tvShow.genres ? (
                  <p>Genres: {tvShow.genres.map((genre) => genre.name).join(', ')}</p>
                ) : (
                  <p>Genres: N/A</p>
                )}
                <p>{tvShow.overview}</p>
                <Link to={`/tv-shows/${tvShow.id}`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>View Trailers</Link>
                <br/>
                <Link to={`/tv-shows/${tvShow.id}/reviews`} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>Reviews</Link>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiringToday;