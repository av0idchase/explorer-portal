import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await getLeaderboard();
        setLeaders(res.data);
      } catch {
        setError('Failed to load leaderboard.');
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quiz Type</th>
            <th>Best Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders.length === 0 && (
            <tr>
              <td colSpan="3">No results yet</td>
            </tr>
          )}
          {leaders.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.quizType}</td>
              <td>{item.bestScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
