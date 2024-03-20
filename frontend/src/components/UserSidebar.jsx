import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { sendRequest } from '../Request';

const buttonStyle = {
  float: 'right',
  color: '#FF5A5F',
  fontSize: '1.1rem',
  fontWeight: 'bold',
};

export const handleLogout = () => {
  sendRequest('user/auth/logout', 'POST').then(() => {
    localStorage.clear();
    window.location.href = '/';
  });
};

export const SideBar = () => {
  const userEmail = localStorage.getItem('email');

  const handleViewListings = () => {
    window.location.href = '/hostedlistings';
  };

  return (
    <Box>
      {userEmail
        ? (
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            id='yourListingsButton'
            data-testid='yourListingsButton'
            sx={buttonStyle}
            onClick={handleViewListings}
          >
            Your Listings
          </Button>
          <Button
            id='logoutButton'
            sx={buttonStyle}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
          )
        : (
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <RegisterButton onClick={() => (window.location.href = '/regist')} />
          <SignInButton onClick={() => (window.location.href = '/login')} />
        </div>
          )}
    </Box>
  );
};

export const RegisterButton = ({ onClick }) => {
  return (
    <Button
      name='registerButton'
      id='registerButton'
      sx={buttonStyle}
      onClick={onClick}
    >
      Register
    </Button>
  );
};

export const SignInButton = ({ onClick }) => {
  return (
    <Button
      name='signInButton'
      sx={buttonStyle}
      onClick={onClick}
    >
      Sign in
    </Button>
  );
};

export default SideBar;
