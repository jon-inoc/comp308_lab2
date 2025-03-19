import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import CHECK_AUTH from '../mutations/CheckAuth';
import LOG_IN from '../mutations/Login';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { data: authData, loading: authLoading, error: authError } = useQuery(CHECK_AUTH, {
    fetchPolicy: "network-only",
  });

  const [login, { error: loginError, loading: loginLoading }] = useMutation(LOG_IN, {
    onCompleted: (response) => {
      if (response?.login?.user) {
        onLogin(response.login.user);
        navigate('/main');
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
    },
  });

  const authenticateUser = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: { username, password } });
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  useEffect(() => {
    if (!authLoading && authError) {
      console.error("GraphQL query error:", authError);
    }
    if (!authLoading && authData?.me) {
      onLogin(authData.me);
      navigate("/main");
    }
  }, [authData, authLoading, authError]);

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Column */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to 308 ESPORT TOURNAMENTS
        </Typography>
        <Typography variant="h6" align="center" sx={{ maxWidth: 400 }}>
          Join the ultimate esports experience. Compete, connect, and conquer in tournaments designed for players like you!
        </Typography>
      </Grid>

      {/* Right Column */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={authenticateUser}
            sx={{ mt: 2 }}
          >
            {/* Username Field */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loginLoading}
            >
              {loginLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            {/* Error Message */}
            {loginError && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Login failed. Please check your credentials.
              </Typography>
            )}
          </Box>

          {/* Link to Register */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            New player?{' '}
            <Link to="/register" style={{ color: '#90caf9', fontWeight: 'bold' }}>
              Register here
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
