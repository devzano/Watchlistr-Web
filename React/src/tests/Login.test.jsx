import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from '../Login';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login', () => {
  it('should submit the form with valid credentials and navigate to the popular media page', async () => {
    const onLogin = jest.fn();
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByLabelText, getByRole } = render(<Login onLogin={onLogin} />);
    const usernameInput = getByLabelText('Username:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByRole('button', { name: 'Login' });

    const mockResponse = {
      data: {
        userId: 1,
        username: 'testuser',
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:6227/login', {
        username: 'testuser',
        password: 'testpass',
      });
      expect(onLogin).toHaveBeenCalledWith(1);
      expect(sessionStorage.getItem('userId')).toBe('1');
      expect(sessionStorage.getItem('username')).toBe('testuser');
      expect(navigate).toHaveBeenCalledWith('/popular-media');
    });
  });
});
