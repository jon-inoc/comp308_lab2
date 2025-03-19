import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ADD_PLAYER_TO_TOURNAMENT from "../mutations/JoinTournaments";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      username
    }
  }
`;

const GET_TOURNAMENTS = gql`
  query GetTournaments {
    tournaments {
      id
      name
    }
  }
`;

const AddPlayerToTournament = () => {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");

  const { loading: playersLoading, data: playersData } = useQuery(GET_PLAYERS);
  const { loading: tournamentsLoading, data: tournamentsData } = useQuery(GET_TOURNAMENTS);
  const [assignPlayer, { loading: assignLoading }] = useMutation(ADD_PLAYER_TO_TOURNAMENT, {
    onCompleted: () => toast.success("Player assigned successfully!"),
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlayer || !selectedTournament) {
      toast.error("Please select both player and tournament.");
      return;
    }
    assignPlayer({ variables: { tournamentId: selectedTournament, playerId: selectedPlayer } });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "background.default", padding: 3 }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Add Player to Tournament
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Select Player */}
          <TextField
            select
            fullWidth
            label="Select Player"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            variant="outlined"
            margin="normal"
            disabled={playersLoading}
            helperText={playersLoading ? "Loading players..." : ""}
          >
            <MenuItem value="">-- Choose Player --</MenuItem>
            {playersData?.players.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.username}
              </MenuItem>
            ))}
          </TextField>

          {/* Select Tournament */}
          <TextField
            select
            fullWidth
            label="Select Tournament"
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            variant="outlined"
            margin="normal"
            disabled={tournamentsLoading}
            helperText={tournamentsLoading ? "Loading tournaments..." : ""}
          >
            <MenuItem value="">-- Choose Tournament --</MenuItem>
            {tournamentsData?.tournaments.map((tournament) => (
              <MenuItem key={tournament.id} value={tournament.id}>
                {tournament.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={assignLoading}
          >
            {assignLoading ? <CircularProgress size={24} /> : "Add Player"}
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

export default AddPlayerToTournament;