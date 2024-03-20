import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '../Request';
import InputAdornment from '@mui/material/InputAdornment';
import { Alert, Collapse } from '@mui/material';

let time = null;

const Login = () => {
  const [userEmail, setUserEmail] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const signIn = (email, password) => {
    sendRequest('user/auth/login', 'POST', {
      email,
      password,
    }).then((data) => {
      console.log('data:', data)
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      console.log('login success');
      window.location.href = '/';
    }).catch((err) => {
      if (err) {
        clearTimeout(time)
        setOpen(true)
        time = setTimeout(() => {
          setOpen(false)
        }, 2000)
      }
    })
  };

  // navigate  different routes
  const navigate = useNavigate();
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

  const signInButtonStyle = {
    color: '#FFF',
    backgroundColor: '#FF385C',
  };

  const createAccountStyle = {
    color: '#FF385C', // Change the color to your desired color
    cursor: 'pointer',
    fontweight: 'bold',
  };

  const signInTextStyle = {
    marginBottom: '5px',
    fontSize: '24px',
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box style={containerStyle}>
      <form style={formStyle}>
        <Typography variant="h4" style={signInTextStyle}>
            Welcome to AirBrB
        </Typography>
        <TextField
          fullWidth
          id="email"
          label="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          style={signInButtonStyle}
          onClick={() => signIn(userEmail, userPassword)}
        >
          Sign in
        </Button>
        <Typography variant="subtitle1">
          Don&apos;t have an account?{' '}
          <span
            className="clickable"
            id="redirect-to-regist"
            style={createAccountStyle}
            onClick={() => navigate('/regist')}
          >
            Create one
          </span>
          !
        </Typography>
      </form>
      <Collapse in={open} sx={{ position: 'absolute', top: '10%' }}>
        <Alert severity="error" >Invalid email or password</Alert>
      </Collapse>
    </Box>
  );
}

export default Login;
