import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import GET_PLAYERS from '../mutations/GetPlayers';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';

const PlayerList = () => {
  const { loading, error, data } = useQuery(GET_PLAYERS);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && error) {
      console.error("❌ GraphQL query error:", error);
    }
  }, [data, loading, error]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        Error: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Player List
      </Typography>
      <Card elevation={3} sx={{ padding: 2 }}>
        <List>
          {data.players.map((player) => (
            <ListItem key={player.id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <ListItemAvatar>
                <Avatar>{player.username.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {player.username}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      <strong>ID:</strong> {player.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Ranking:</strong> {player.ranking ? player.ranking : "N/A"}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Card>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={() => navigate('/main')}
      >
        Back to Main
      </Button>
    </Box>
  );
};

export default PlayerList;