const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./server/config/database'); // Import Sequelize instance
const authTeacherRoutes = require('./server/routes/authTeacher');
const authStudentRoutes = require('./server/routes/authStudent');
const examRoutes = require('./server/routes/exams');
const questionRoutes = require('./server/routes/questions');
const resultRoutes = require('./server/routes/results');
const db = require('./server/models'); // Import the db object

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // <--- Убедитесь, что cors() здесь
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/auth/teacher', authTeacherRoutes);
app.use('/auth/student', authStudentRoutes);
app.use('/exams', examRoutes);
app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);



// Sync database and start server
console.log('Attempting to connect to the database...');
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