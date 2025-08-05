import React, { useEffect, useState } from 'react';
import { getResults } from '../api';

export default function Profile() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await getResults();
        setResults(res.data);
      } catch {
        setError('Failed to load profile results.');
      }
    }
    fetchResults();
  }, []);

  const totalQuizzes = results.length;
  const bestScoresByType = results.reduce((acc, curr) => {
    if (!acc[curr.quizType] || curr.score > acc[curr.quizType]) {
      acc[curr.quizType] = curr.score;
    }
    return acc;
  }, {});

  return (
    <div className="container">
      <h2>Your Profile</h2>
      {error && <p className="error">{error}</p>}
      <p>Total Quizzes Taken: {totalQuizzes}</p>
      <h3>Best Scores:</h3>
      {Object.keys(bestScoresByType).length === 0 && <p>No quizzes taken yet.</p>}
      <ul>
        {Object.entries(bestScoresByType).map(([type, score]) => (
          <li key={type}>{type}: {score}</li>
        ))}
      </ul>
      <h3>Quiz History:</h3>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            {result.quizType} - Score: {result.score} / {result.total} on {new Date(result.takenAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
