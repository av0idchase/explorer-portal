import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzes, submitQuiz } from '../api';

export default function Quiz() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await getQuizzes(type);
        setQuestions(res.data);
      } catch {
        setError('Failed to load quiz questions.');
      }
    }
    fetchQuestions();
  }, [type]);

  const handleNext = () => {
    if (selectedAnswer === questions[currentIndex].answer) {
      setScore(score + 1);
    }
    setSelectedAnswer('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
      saveResult();
    }
  };

  const saveResult = async () => {
    try {
      await submitQuiz({ quizType: type, score, total: questions.length });
    } catch {
      // Fail silently
    }
  };

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!questions.length) return <div className="container"><p>Loading questions...</p></div>;

  if (quizFinished) {
    return (
      <div className="container">
        <h2>Quiz Complete!</h2>
        <p>
          Your Score: {score} / {questions.length}
        </p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="container">
      <h3>Quiz: {type}</h3>
      <div className="quiz-question">
        <p><strong>Question {currentIndex + 1}:</strong> {question.question}</p>
      </div>
      <div className="quiz-options">
        {question.options.map((opt, i) => (
          <label key={i}>
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selectedAnswer === opt}
              onChange={() => setSelectedAnswer(opt)}
              required
            />
            {opt}
          </label>
        ))}
      </div>
      <button disabled={!selectedAnswer} onClick={handleNext}>
        {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
}
