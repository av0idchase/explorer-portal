const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
