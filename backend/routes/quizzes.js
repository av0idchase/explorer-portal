const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Add quiz questions (you can extend this to seed from your codes)
router.post('/add', authenticateToken, (req, res) => {
  const { type, question, options, answer } = req.body;
  if (!type || !question || !options || !answer) return res.status(400).json({ message: 'Missing quiz data' });

  const optionsStr = JSON.stringify(options);
  db.run(
    `INSERT INTO quizzes (type, question, options, answer) VALUES (?, ?, ?, ?)`,
    [type, question, optionsStr, answer],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ id: this.lastID });
    }
  );
});

// Get quizzes by type
router.get('/:type', authenticateToken, (req, res) => {
  const type = req.params.type;
  db.all(`SELECT id, question, options FROM quizzes WHERE type = ?`, [type], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const quizzes = rows.map(row => ({
      id: row.id,
      question: row.question,
      options: JSON.parse(row.options)
    }));
    res.json(quizzes);
  });
});

// Submit quiz result
router.post('/submit', authenticateToken, (req, res) => {
  const { quizType, score, total } = req.body;
  if (!quizType || typeof score !== 'number' || typeof total !== 'number')
    return res.status(400).json({ message: 'Missing score data' });

  const userId = req.user.id;
  db.run(
    `INSERT INTO results (userId, quizType, score, total) VALUES (?, ?, ?, ?)`,
    [userId, quizType, score, total],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ id: this.lastID });
    }
  );
});

// Get quiz results for user
router.get('/results', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all(`SELECT * FROM results WHERE userId = ? ORDER BY takenAt DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

// Leaderboard (top scores)
router.get('/leaderboard', authenticateToken, (req, res) => {
  db.all(
    `SELECT users.name, results.quizType, MAX(results.score) as bestScore 
     FROM results 
     JOIN users ON results.userId = users.id
     GROUP BY users.id, results.quizType
     ORDER BY bestScore DESC
     LIMIT 10`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
});

module.exports = router;
