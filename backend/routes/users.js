const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Get basic info of all users - only for admins
router.get('/', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

  db.all(`SELECT id, name, email FROM users`, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;
