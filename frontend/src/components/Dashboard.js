import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Replace these quiz types with your actual code categories later
  const quizTypes = [
    'Vehicle Codes',
    'Penal Codes',
    '10-11 Codes',
    'Emergency Codes'
  ];

  return (
    <div className="container">
      <h2>Choose a Quiz</h2>
      <ul>
        {quizTypes.map((type) => (
          <li key={type}>
            <Link to={`/quiz/${encodeURIComponent(type)}`}>{type}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
