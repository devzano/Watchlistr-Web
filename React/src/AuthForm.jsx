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

const renderBackendURL = process.env.REACT_APP_RENDER_BACKEND_URL;

const AuthForm = ({onLogin}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isPasswordMatching = password === confirmPassword;
  const [backgroundImage, setBackgroundImage] = useState(bgImage1);
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
            const res = await axios.post(`https://${renderBackendURL}/signup`, formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            toast.success(`User ${username} Created Successfully`, {autoClose: 2000, theme: 'dark'})
          if (res.data.error) {
            toast.error(res.data.error);
          } else {
            try {
              const formData = new URLSearchParams();
              formData.append('username', username);
              formData.append('password', password);
              const res = await axios.post(`https://${renderBackendURL}/login`, formData.toString(), {
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
          setIsLoading(false);
          toast.error('Error While Signing Up, Please Try Again Later.');
        }
      } else {
        setIsLoading(false);
        toast.error("Password Don't Match!");
      }
    } else {
      try {
        setIsLoading(true);
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const res = await axios.post(`https://${renderBackendURL}/login`, formData.toString(), {
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
        setIsLoading(false);
        toast.error(error.response.data.error, {autoClose: 2000, theme: 'dark'});
      }
    }
  };

  const areInputsValid = () => {
    if (isSignup) {
      const isUsernameValid = username.trim().length >= 6;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&!_+=\-|~*(){}[\]:;<>,.?\\/])[A-Za-z\d@#$%^&!_+=\-|~*(){}[\]:;<>,.?\\/]*$/;
      const isPasswordValid = password.match(passwordRegex);
      const doPasswordsMatch = password === confirmPassword;
      return isUsernameValid && isPasswordValid && doPasswordsMatch;
    } else {
      return username.trim() !== '' && password.trim() !== '';
    }
  };

  return (
    <div className={isSignup ? 'signup' : 'login'} style={{backgroundImage: `url(${backgroundImage})`}}>
      <form className={isSignup ? 'signup-form' : 'login-form'} onSubmit={handleSubmit}>
        <h1>Welcome to Watchlistr</h1>
        <label>Username:<input className="authForm-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/></label><br/>
        <label>Password:<input className="authForm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ borderColor: isSignup && confirmPassword ? isPasswordMatching ? 'seagreen' : 'crimson' : ''}}/></label><br/>
        {isSignup && (
          <>
            <label>Confirm Password:<input className="authForm-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ borderColor: password ? (isPasswordMatching ? 'seagreen' : 'crimson') : '' }}/>
            </label>
            <div className="password-requirements">
              <p>Your password must meet the following criteria:</p>
              <ul>
                <li>At least 6 characters long</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one digit</li>
                <li>Contain at least one special character</li>
              </ul>
            </div>
          </>
        )}
        <br/>
        {isLoading ? (<div className="lds-ripple"><div></div><div></div></div>) : (
          <button className="authForm-button" type="submit" disabled={!areInputsValid()}>{isSignup ? 'Signup' : 'Login'}</button>
        )}
        <button className="authForm-button" type="button" onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Switch to Login' : 'No account? Signup'}</button>
      </form>
    </div>
  );
};

AuthForm.propTypes = {
  onLogin: PropTypes.func,
};

export default AuthForm;