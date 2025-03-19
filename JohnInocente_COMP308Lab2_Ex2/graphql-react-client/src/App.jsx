import { useState } from 'react';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import Login from './components/Login';
import Home from './components/Home';
import SignUp from './components/Signup';
import View from './components/View';
import PlayerList from './components/PlayerList';
import TournamentList from './components/TournamentList';
import CreateTournament from './components/CreateTournament';
import CreateUser from './components/CreateUser';
import AddPlayerToTournament from './components/AddPlayerToTournament';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state for login status
  const [user, setUser] = useState(null);

  const handleLogin = (User) => {
    setIsLoggedIn(true);
    setUser(User);
    console.log('login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    console.log('logout');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures the dark theme is applied globally */}
      <Router>
        <Routes>
            <Route index element={<Login onLogin={handleLogin} isLogin={isLoggedIn} />} />
            <Route path="register" element={<SignUp onCreate={handleLogin}></SignUp>}></Route>
            <Route path="main" element={<View user={user} />}></Route>
            <Route path="playerlist" element={<PlayerList />}></Route>
            <Route path="tournamentlist" element={<TournamentList user={user} />}></Route>
            <Route path="createtournament" element={<CreateTournament />}></Route>
            <Route path="createuser" element={<CreateUser />}></Route>
            <Route path="addplayer" element={<AddPlayerToTournament />}></Route>
          </Routes>
      </Router>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </ThemeProvider>
  );
}

export default App;