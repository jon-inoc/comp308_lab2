import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CREATE_TOURNAMENT from "../mutations/CreateTournament";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

const CreateTournament = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    date: "",
    status: "Upcoming", // Default status
  });

  const [createTournament, { loading, error }] = useMutation(CREATE_TOURNAMENT, {
    onCompleted: () => {
      toast.success("Tournament created successfully!");
      navigate("/main"); // Navigate to main after showing toast
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTournament({
      variables: {
        name: formData.name,
        game: formData.game,
        date: formData.date,
        status: formData.status,
      },
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Create Tournament
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            Error: {error.message}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Tournament Name */}
          <TextField
            label="Tournament Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Game */}
          <TextField
            label="Game"
            name="game"
            variant="outlined"
            fullWidth
            value={formData.game}
            onChange={handleChange}
            required
          />

          {/* Date */}
          <TextField
            label="Date"
            name="date"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
            required
          />

          {/* Status */}
          <TextField
            label="Status"
            name="status"
            select
            variant="outlined"
            fullWidth
            value={formData.status}
            onChange={handleChange}
            required
          >
            <MenuItem value="Upcoming">Upcoming</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Tournament"}
          </Button>
        </Box>

        {/* Back Button */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={() => navigate("/main")}
        >
          Back to Main
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateTournament;