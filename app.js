const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./server/config/database'); // Sequelize instance
const authTeacherRoutes = require('./server/routes/authTeacher');
const authStudentRoutes = require('./server/routes/authStudent');
const examRoutes = require('./server/routes/exams');
const questionRoutes = require('./server/routes/questions');
const resultRoutes = require('./server/routes/results');
const studentRoutes = require('./server/routes/students');
const assignmentRoutes = require('./server/routes/assignments');
const db = require('./server/models');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth/teacher', authTeacherRoutes);
app.use('/auth/student', authStudentRoutes);
app.use('/exams', examRoutes);
app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);
app.use('/students', studentRoutes);
app.use('/assignments', assignmentRoutes);

// Sync database and start server
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
