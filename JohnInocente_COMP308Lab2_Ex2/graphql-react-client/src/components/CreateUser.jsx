import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CREATE_USER from "../mutations/CreateUser";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      toast.success("User created successfully!");
      navigate("/main"); // Navigate to main after showing toast
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({
      variables: {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: "Player",
      },
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "background.default", padding: 3 }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Create User
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            Error: {error.message}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <TextField
            fullWidth
            label="User Name"
            name="name"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
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
            {loading ? <CircularProgress size={24} /> : "Create User"}
          </Button>
        </form>

        {/* Back Button */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/main")}
        >
          Back to Main
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateUser;