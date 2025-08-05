const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'explorer.db'));

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isAdmin INTEGER DEFAULT 0
  )`);

  // Quizzes table
  db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    answer TEXT NOT NULL
  )`);

  // Results table
  db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    quizType TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    takenAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

module.exports = db;
