import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar.jsx';
import AuthForm from './AuthForm.jsx';
import Watchlist from './Watchlist.jsx'
import MediaSearch from './MediaSearch.jsx';
import PopularMedia from './PopularMedia.jsx';
import TopRatedMedia from './TopRatedMedia.jsx';
import MovieMedia from './MovieMedia.jsx';
import TVShowMedia from './TVShowMedia.jsx';
import EpisodesMedia from './EpisodesMedia.jsx'
import MovieReviews from './MovieReviews.jsx';
import TVShowReviews from './TVShowReviews.jsx';
import Reviews from './Reviews.jsx';
import UpcomingMovies from './UpcomingMovies.jsx';
import AiringToday from './AiringToday.jsx';
import ShowsProvider from './TMDBProvider';
import {ToastContainer, toast} from 'react-toastify';
import './styles/App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedUserId = sessionStorage.getItem('userId');
    console.log('storedUserId:', storedUserId);
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (userId) => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
      localStorage.setItem('loggedIn', 'true');
      setUserId(userId);
      setLoggedIn(true);
      toast.success("Logged In Successfully!", {autoClose: 2000, theme: 'dark'})
    } else {
      setLoggedIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setLoggedIn(false);
    setUserId(null);
    toast.success("Logged Out Successfully!", {autoClose: 2000, theme: 'dark'})
  };

  console.log('userID:', userId);

  return (
     <div className="App">
      <Router>
        <ShowsProvider>
        <ToastContainer/>
        <Navbar userId={userId} loggedIn={loggedIn} onLogin={handleLogin} handleLogout={handleLogout}/>
        <Routes>
          <Route path="/" element={<AuthForm onLogin={handleLogin} isSignup/>}/>
          <Route path="/media-search" element={<MediaSearch/>}/>
          <Route path="/movies/:id" element={<MovieMedia/>}/>
          <Route path="/tv-shows/:id" element={<TVShowMedia/>}/>
          <Route path="/tv-shows/:id/episodes" element={<EpisodesMedia/>}/>
          <Route path="/movies/:id/reviews" element={<MovieReviews/>}/>
          <Route path="/tv-shows/:id/reviews" element={<TVShowReviews/>}/>
          <Route path="/top-rated-media" element={<TopRatedMedia/>}/>
          <Route path="/popular-media" element={<PopularMedia/>}/>
          <Route path="/airing-today" element={<AiringToday/>}/>
          <Route path="/upcoming-movies" element={<UpcomingMovies/>}/>
          <Route path="/media-reviews" element={<Reviews/>}/>
          <Route path="/watchlist" element={<Watchlist userId={userId} onLogin={handleLogin}/>}/>
        </Routes>
        </ShowsProvider>
      </Router>
    </div>
  );
};

export default App;