import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import GET_TOURNAMENTS from "../mutations/GetTournaments";
import JOIN_TOURNAMENT from '../mutations/JoinTournaments';
import GET_PLAYERDATA from '../mutations/GetPlayerData';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TournamentList = ({ user }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_TOURNAMENTS, {
    fetchPolicy: "network-only",
  });
  const [expandedTournament, setExpandedTournament] = useState(null);

  const [joinTournament] = useMutation(JOIN_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
    onError: (err) => toast.error(err.message),
    onCompleted: () => toast.success("Joined tournament successfully!"),
  });

  const { data: playerData, loading: playerLoading, error: playerError } = useQuery(GET_PLAYERDATA, {
    variables: { userId: user?.id },
    fetchPolicy: "network-only",
    skip: !user || user.role === "Admin",
  });

  useEffect(() => {
    if (!loading && error) {
      console.error("GraphQL query error:", error);
    }
  }, [data, loading, error]);

  if (loading || playerLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || playerError) {
    return (
      <Typography variant="body1" color="error" align="center">
        Error: {error?.message || playerError?.message}
      </Typography>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming": return "primary";
      case "Ongoing": return "success";
      case "Completed": return "secondary";
      default: return "default";
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tournament List
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Game</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.tournaments.map((tournament) => {
              const hasJoined = tournament?.players?.some(player => player.id === playerData?.playerByUserId?.id);

              return (
                <React.Fragment key={tournament.id}>
                  <TableRow>
                    <TableCell>{tournament.id}</TableCell>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>{tournament.game}</TableCell>
                    <TableCell>{new Date(Number(tournament.date)).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={tournament.status}
                        color={getStatusColor(tournament.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {user?.role === "Player" && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={hasJoined}
                          onClick={() =>
                            joinTournament({ variables: { tournamentId: tournament.id, playerId: playerData.playerByUserId.id } })
                          }
                        >
                          {hasJoined ? "Joined" : "Join"}
                        </Button>
                      )}
                      {user?.role === "Admin" && (
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => setExpandedTournament(expandedTournament === tournament.id ? null : tournament.id)}
                          sx={{ marginLeft: 1 }}
                        >
                          {expandedTournament === tournament.id ? "Hide Players" : "Show Players"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedTournament === tournament.id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Accordion expanded>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Players</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {tournament.players?.length > 0 ? (
                              tournament.players.map((player) => (
                                <Typography key={player.id}>
                                  {player.username} (Ranking: {player.ranking || "N/A"})
                                </Typography>
                              ))
                            ) : (
                              <Typography className="text-muted">No players have joined this tournament yet.</Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate('/main')}>
        Back to Main
      </Button>
    </Box>
  );
};

export default TournamentList;