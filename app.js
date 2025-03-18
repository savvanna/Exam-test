const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./server/config/database'); // Import Sequelize instance
const authRoutes = require('./server/routes/auth');
const examRoutes = require('./server/routes/exams');
const questionRoutes = require('./server/routes/questions');
const resultRoutes = require('./server/routes/results');
const db = require('./server/models'); // Import the db object

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Sync database and start server
// ... (остальной код)

// Sync database and start server
sequelize.authenticate() // Проверяем подключение к БД
  .then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync({ alter: true }); // Синхронизируем модели с БД (создает таблицы, если их нет)
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });