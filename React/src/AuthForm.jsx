import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Navbar.css';
import './styles/AuthForm.css';
import './styles/LoadingIndicator.css'

import bgImage1 from './styles/Screenshots/Login-Background.jpg';
import bgImage2 from './styles/Screenshots/Login-Background1.jpg';
import bgImage3 from './styles/Screenshots/Login-Background2.jpg';
import bgImage4 from './styles/Screenshots/Login-Background3.jpg';
import bgImage5 from './styles/Screenshots/Login-TVBackground.jpg';
import bgImage6 from './styles/Screenshots/Login-TVBackground1.jpg';

const replitBackendURL = process.env.REACT_APP_REPLIT_BACKEND_URL;

const AuthForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(bgImage1);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const images = [bgImage1, bgImage2, bgImage3, bgImage4, bgImage5, bgImage6];
    images.forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
    });
    const rotateBackgroundImage = () => {
      const currentIndex = images.indexOf(backgroundImage);
      const nextIndex = (currentIndex + 1) % images.length;
      setBackgroundImage(images[nextIndex]);
    };
    const intervalId = setInterval(rotateBackgroundImage, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [backgroundImage]);

  const navi = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      if (password === confirmPassword) {
        try {
          setIsLoading(true);
          const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            const res = await axios.post(`https://${replitBackendURL}/signup`, formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

          if (res.data.error) {
            toast.error(res.data.error);
          } else {
            try {
              const formData = new URLSearchParams();
              formData.append('username', username);
              formData.append('password', password);
              const res = await axios.post(`https://${replitBackendURL}/login`, formData.toString(), {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                  },
              });
              onLogin(res.data.userId);
              sessionStorage.setItem('userId', res.data.userId);
              sessionStorage.setItem('username', res.data.username);
              navi('/popular-media');
              setIsLoading(false);
            } catch (error) {
              toast.error(error.response.data.error, {autoClose: 2000, theme: 'dark'});
            }
          }
        } catch (error) {
          toast.error('Error While Signing Up, Please Try Again Later.');
        }
      } else {
        toast.error("Password Don't Match!");
      }
    } else {
      try {
        setIsLoading(true);
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const res = await axios.post(`https://${replitBackendURL}/login`, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        onLogin(res.data.userId);
        sessionStorage.setItem('userId', res.data.userId);
        sessionStorage.setItem('username', res.data.username);
        navi('/popular-media');
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.error, {autoClose: 2000, theme: 'dark'});
      }
    }
  };

  return (
    <div className={isSignup ? 'signup' : 'login'} style={{backgroundImage: `url(${backgroundImage})`}}>
      <form className={isSignup ? 'signup-form' : 'login-form'} onSubmit={handleSubmit}>
        <h1>Welcome to Watchlistr</h1>
        <label>Username:<input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/></label><br/>
        <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/></label><br/>
        {isSignup && (<label>Confirm Password:<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>)}
        <br/>
        {isLoading ? (<div className="lds-ripple"><div></div><div></div></div>) : (
          <button className="authForm-button" type="submit" onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>{isSignup ? 'Signup' : 'Login'}</button>
        )}
        <button className="authForm-button" type="button" onClick={() => setIsSignup(!isSignup)} onMouseOver={(e) => (e.target.style.opacity = 0.5)} onMouseOut={(e) => (e.target.style.opacity = 1)}>{isSignup ? 'Switch to Login' : 'No account? Signup'}</button>
      </form>
    </div>
  );
};

AuthForm.propTypes = {
  onLogin: PropTypes.func,
};

export default AuthForm;