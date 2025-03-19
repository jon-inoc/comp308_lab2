import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import GET_TOURNAMENTS from "../mutations/GetTournaments";
import JOIN_TOURNAMENT from '../mutations/JoinTournaments';
import GET_PLAYERDATA from '../mutations/GetPlayerData';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TournamentList = ({ user }) => {
    const navigate = useNavigate();
    const { loading, error, data, refetch } = useQuery(GET_TOURNAMENTS, {
        fetchPolicy: "network-only", // Always fetch fresh data
      });
    const [expandedTournament, setExpandedTournament] = useState(null);

    const [joinTournament] = useMutation(JOIN_TOURNAMENT, {
        refetchQueries: [{ query: GET_TOURNAMENTS }], // Refresh data after joining
        onError: (err) => alert(err.message),
        onCompleted: () => {
            toast.success("Join tournament successfully!");
        }
    });

    const { data: playerData, loading: playerLoading, error: playerError } = useQuery(GET_PLAYERDATA, {
        variables: { userId: user?.id },
        fetchPolicy: "network-only",
        skip: !user || user.role === "Admin"
    });

    useEffect(() => {
        if (!loading && error) {
            console.error("GraphQL query error:", error);
        }
    }, [data, loading, error]);

    useEffect(() => {
        if (user?.role === "Admin") return;

        if (!playerLoading && playerError) {
            console.error("GraphQL query error:", playerError);
        }

        if (!playerLoading && playerData?.playerByUserId) {
            console.log("User is logged in, redirecting...");
            console.log("Player id:", playerData.playerByUserId.id)
        } else if (!playerLoading) {
            console.log("User didn't log in");
            //navigate('/');
        }
    }, [playerData, playerLoading, playerError]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <h2 className="fw-bold text-dark mb-4">Tournaments</h2>
            <table className="table table-striped shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Game</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.tournaments.map((tournament) => {
                        console.log("Tournament Players:", tournament?.players);
                        console.log("Player ID:", playerData?.playerByUserId?.id);

                        const hasJoined = tournament?.players?.some(player => player.id === playerData?.playerByUserId?.id);

                        console.log("Has Joined:", hasJoined);
                        return (
                            <React.Fragment key={tournament.id}>
                                <tr>
                                    <td>{tournament.id}</td>
                                    <td>{tournament.name}</td>
                                    <td>{tournament.game}</td>
                                    <td>{new Date(Number(tournament.date)).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge bg-${getStatusColor(tournament.status)}`}>
                                            {tournament.status}
                                        </span>
                                    </td>
                                    <td>
                                        {user?.role === "Player" && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                disabled={hasJoined}
                                                onClick={() =>
                                                    joinTournament({ variables: { tournamentId: tournament.id, playerId: playerData.playerByUserId._id } })
                                                }
                                            >
                                                {hasJoined ? "Joined" : "Join"}
                                            </button>
                                        )}
                                        {user?.role === "Admin" && (

                                            <button
                                                className="btn btn-info btn-sm ms-2"
                                                onClick={() => setExpandedTournament(expandedTournament === tournament.id ? null : tournament.id)}
                                            >
                                                {expandedTournament === tournament.id ? "Hide Players" : "Show Players"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {expandedTournament === tournament.id && (
                                    <tr>
                                        <td colSpan="6">
                                            <ul className="list-group">
                                                {tournament.players?.length > 0 ? (
                                                    tournament.players.map((player) => (
                                                        <li key={player.id} className="list-group-item">
                                                            {player.username} (Ranking: {player.ranking || "N/A"})
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No players have joined this tournament yet.</p>
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            <button className="btn btn-primary mt-4" onClick={() => navigate('/main')}>
                Back to Main
            </button>
        </div>
    );
};

// Function to color-code tournament status
const getStatusColor = (status) => {
    switch (status) {
        case "Upcoming": return "primary";
        case "Ongoing": return "success";
        case "Completed": return "secondary";
        default: return "dark";
    }
};

export default TournamentList;