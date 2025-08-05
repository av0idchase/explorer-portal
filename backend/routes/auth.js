const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ message: 'Email already registered' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      const user = { id: this.lastID, name, email };
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const tokenUser = { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin };
    const token = jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: tokenUser });
  });
});

module.exports = router;

