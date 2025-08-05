import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import UsersList from './components/UsersList';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (!user) {
    return (
      <Router>
        <nav>
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <nav>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
          {user.isAdmin && <Link to="/users">Users</Link>}
        </div>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:type" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        {user.isAdmin && <Route path="/users" element={<UsersList />} />}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
