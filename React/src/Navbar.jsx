import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Navbar.css';
import logo from './styles/logo.svg';

const replitBackendURL = process.env.REACT_APP_REPLIT_BACKEND_URL;

const Navbar = (props) => {
  // eslint-disable-next-line
  const {loggedIn, handleLogout, userId} = props;
  const navi = useNavigate();
  const loco = useLocation();
  const username = sessionStorage.getItem('username');
  const isAuthPage = loco.pathname === '/';
  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const showIcon = window.innerWidth <= 767;
      setShowMenuIcon(showIcon);
      setIsLogoVisible(showIcon);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {if (isLogoVisible) {toast.info('Tap logo for menu', {autoClose: 2000, theme: 'dark'})}}, [isLogoVisible]);

  useEffect(() => {setShowDropdown(false)}, [loggedIn]);

  const toggleDropdown = () => {setShowDropdown(!showDropdown)};

  const toggleMenu = () => {setShowMenu(!showMenu)};

  const deleteAccount = async () => {
    try {
        const res = await axios.delete(`https://${replitBackendURL}/users/${username}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (res.data.error) {
            toast.error(res.data.error);
        } else {
            setShowDeleteConfirmation(false);

            handleLogout();
            navi('/');
        }
    } catch (error) {
        toast.error('Error deleting account, please try again later.');
    }
};

  const navToSignup = () => {navi('/')};

  const navToHome = () => {navi('/popular-media')};

  const logoutOnly = () => {handleLogout(); navi('/')};

  return (
    !isAuthPage && (
    <nav className="navbar">
      {loggedIn ? (
        <>
          <div className="header-container">
          {showMenuIcon && (
          <img className="logo menu-icon" onClick={toggleMenu} src={logo} alt="Logo"/>
          )}
            <div className="dropdown" onClick={toggleDropdown} onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <button className="dropbtn">
              <span onClick={navToHome}>
                Welcome, <span className='user'>{username.charAt(0).toUpperCase() + username.slice(1)}</span>
              </span>
            </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <button onClick={logoutOnly} className="accButton">Logout</button>
                  <br/>
                  <button onClick={() => setShowDeleteConfirmation(true)} className="accButton">Delete Account</button>
                </div>
              )}
            </div>
          </div>
          {showDeleteConfirmation && (
            <div className="delete-confirmation">
              <div className="confirmation-content">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete your account?</p>
                <button onClick={deleteAccount} className="delete-confirm-btn">Yes, Delete</button>
                <button onClick={() => setShowDeleteConfirmation(false)} className="delete-cancel-btn">Cancel</button>
              </div>
            </div>
          )}
        </>
      ) : (
        loco.pathname !== '/' && (
          <button onClick={navToSignup} className="signupButton">Signup</button>
        )
      )}
      {loggedIn && (
        <>
          <div className={`navbar-links ${showMenu ? 'show-menu' : ''}`}>
            <NavLink to={'/media-search'}>Search</NavLink>
            <NavLink to={'/popular-media'}>Popular</NavLink>
            <NavLink to={'/upcoming-movies'}>Upcoming</NavLink>
            <NavLink to={'/airing-today'}>Airing Today</NavLink>
            <NavLink to={'/top-rated-media'}>Top Rated</NavLink>
            <NavLink to={'/watchlist'}>Watchlist</NavLink>
            <NavLink to={'/media-reviews'}>Reviews</NavLink>
          </div>
        </>
      )}
    </nav>
    )
  );
};

Navbar.propTypes = {
  loggedIn: PropTypes.bool,
  handleLogout: PropTypes.func,
  userId: PropTypes.any,
};

export default Navbar;