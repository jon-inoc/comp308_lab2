import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import SIGN_UP from '../mutations/Signup';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';

function CreateUser({ onCreate }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', password: '', repassword: '' });
  const [passwordError, setError] = useState('');
  const [signup, { loading }] = useMutation(SIGN_UP);

  const handleSignup = async () => {
    if (user.password !== user.repassword) {
      setError('Passwords do not match!');
      return;
    }

    setError(''); // Clear error if passwords match

    try {
      const { data } = await signup({
        variables: { username: user.username, email: user.email, password: user.password, role: 'Player' },
      });

      if (!data || !data.signup || !data.signup.user) {
        setError('Signup failed. Please try again.');
        return;
      }

      onCreate(data.signup.user);
      navigate('/main');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
    }
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={5}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            {/* Username Field */}
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              margin="normal"
              onChange={onChange}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              onChange={onChange}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              onChange={onChange}
            />

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Confirm Password"
              name="repassword"
              type="password"
              variant="outlined"
              margin="normal"
              onChange={onChange}
              error={!!passwordError}
              helperText={passwordError}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>

          {/* Link to Login */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/" style={{ color: '#90caf9', fontWeight: 'bold' }}>
              Sign in here
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CreateUser;