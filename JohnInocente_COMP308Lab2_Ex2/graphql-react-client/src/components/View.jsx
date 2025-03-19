import React, { useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Drawer,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

import GET_PLAYERDATA from '../mutations/GetPlayerData';
import GET_ALL_PLAYERS from '../mutations/GetPlayers';
import GET_ALL_TOURNAMENTS from '../mutations/GetTournaments';
import LOG_OUT from '../mutations/Logout';

function View({ user }) {
    const navigate = useNavigate();

    const { data: authData, loading: authLoading, error: authError, refetch: refetchAuthData } = useQuery(GET_PLAYERDATA, {
        variables: { userId: user?.id },
        fetchPolicy: "network-only",
        skip: !user || user.role === "Admin",
    });

    const { data: playersData, refetch: refetchPlayersData } = useQuery(GET_ALL_PLAYERS, {
        skip: user?.role !== "Admin",
    });

    const { data: tournamentsData, refetch: refetchTournamentsData } = useQuery(GET_ALL_TOURNAMENTS, {
        skip: user?.role !== "Admin",
    });

    const [logout] = useMutation(LOG_OUT, {
        onCompleted: () => {
            toast.success("Logged out successfully");
            navigate('/');
        },
        onError: (err) => {
            console.error("Logout failed:", err.message);
        },
    });

    useEffect(() => {
        // Refetch data when the component is mounted or navigated to
        if (user?.role === "Admin") {
            refetchPlayersData();
            refetchTournamentsData();
        } else {
            refetchAuthData();
        }
    }, [user, refetchAuthData, refetchPlayersData, refetchTournamentsData]);

    const handleLogout = () => {
        logout();
    };

    const menuItems = user?.role === "Admin" ? [
        { text: "Create User", action: () => navigate('/createUser') },
        { text: "Create Tournament", action: () => navigate('/createTournament') },
        { text: "Add Player to Tournament", action: () => navigate('/addPlayer') },
        { text: "Players", action: () => navigate('/playerlist') },
        { text: "Tournaments", action: () => navigate('/tournamentlist') },
        { text: "Logout", action: handleLogout },
    ] : [
        { text: "Join a Tournament", action: () => navigate('/tournamentlist') },
        { text: "Logout", action: handleLogout },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        borderBottom: '1px solid #e0e0e0', // Optional: Add a separator line
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Dashboard
                    </Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem button key={index} onClick={item.action}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        textAlign: 'center',
                        padding: 2,
                        backgroundColor: 'primary.main',
                        color: '#ffffff',
                    }}
                >
                    <Typography variant="body2" sx={{ fontSize: 'small' }}>
                        © Copyright 2025 COMP308 ASM2
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 'small' }}>
                        Creator: John Inocente
                    </Typography>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: 8 }}
            >
                <Toolbar />


                {user?.role === "Admin" && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Welcome, {user?.username || "Guest"}!
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Overview
                        </Typography>

                        {/* Player and Tournament Count Boxes */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2, // Add spacing between the boxes
                                marginTop: 2,
                            }}
                        >
                            {/* Player Count Box */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    borderRadius: 1,
                                    boxShadow: 1,
                                    width: 'fit-content',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Total Players: {playersData?.players?.length || 0}
                                </Typography>
                            </Box>

                            {/* Tournament Count Box */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    backgroundColor: 'secondary.light',
                                    color: 'secondary.contrastText',
                                    borderRadius: 1,
                                    boxShadow: 1,
                                    width: 'fit-content',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Total Tournaments: {tournamentsData?.tournaments?.length || 0}
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}

                {user?.role == "Player" && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Your Tournaments:
                        </Typography>
                        {authData?.playerByUserId?.tournaments?.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Game</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {authData.playerByUserId.tournaments.map((tournament) => (
                                            <TableRow key={tournament.id}>
                                                <TableCell>{tournament.name}</TableCell>
                                                <TableCell>{tournament.game}</TableCell>
                                                <TableCell>{new Date(parseInt(tournament.date)).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <span className={`badge bg-${getStatusColor(tournament.status)}`}>
                                                        {tournament.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                You haven't joined any tournaments yet.
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}

// Function to color-code tournament status
const getStatusColor = (status) => {
    switch (status) {
        case "Upcoming": return "primary";
        case "Ongoing": return "success";
        case "Completed": return "secondary";
        default: return "default";
    }
};

export default View;