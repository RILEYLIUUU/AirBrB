import React, { useState } from 'react';
import { sendRequest } from '../Request';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export const setLogin = (token, email) => {
  localStorage.setItem('token', token);
  localStorage.setItem('email', email);
};

const Regist = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPass: '',
  });

  const { email, username, password, confirmPass } = formData;
  const nav = useNavigate();

  // Event handler for input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to execute the registration process
  const excuteRegist = () => {
    const body = {
      email,
      password,
      name: username,
    };

    sendRequest('user/auth/register', 'POST', body).then((data) => {
      setLogin(data.token, email);
      nav('/'); // Redirect to the logged-in page
    });
  };

  // Function to validate input before registration
  const validateInput = () => {
    if (!username) {
      alert('Name cannot be empty');
      return;
    }

    if (password !== confirmPass) {
      alert('Password does not match');
      return;
    }

    excuteRegist();
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const formStyle = {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  };

  const registButtonStyle = {
    color: '#FFF',
    backgroundColor: '#FF385C',
  };

  const LoginStyle = {
    color: '#FF385C', // Change the color to your desired color
    cursor: 'pointer',
  };

  const registTitleStyle = {
    marginBottom: '5px',
    fontSize: '24px',
  };

  return (
    <Box style={containerStyle}>
      <form style={formStyle}>
        <Typography variant="h5" style={registTitleStyle}>
          Register your account
        </Typography>
        <TextField
          name="email"
          id="email"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        <TextField
          name="username"
          label="Name"
          id="username"
          placeholder="Name"
          value={username}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={handleChange}
        />
        <TextField
          name="confirmPass"
          id="confirmPass"
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          value={confirmPass}
          onChange={handleChange}
        />
        <Box>
          <Button name='regist' variant="contained" color="primary" onClick={validateInput} style={registButtonStyle} id="regist">
            Register
          </Button>
        </Box>
        <Typography variant="subtitle1">
        Already have an account? {' '}
          <span
            className="clickable"
            id="redirect-to-regist"
            onClick={() => nav('/Login')}
            style={LoginStyle}
          >
            Log in
          </span>
          !
        </Typography>
      </form>
    </Box>
  );
};

export default Regist;
