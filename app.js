
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser'); 

const sequelize = require('./server/config/database');
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


app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Парсеры запросов и CORS

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser()); 

// Статичные файлы
app.use('/uploads', express.static(path.join(__dirname, 'server', 'uploads')));


app.use('/upload', require('./server/routes/upload'));
app.use('/auth/teacher', authTeacherRoutes);
app.use('/auth/student', authStudentRoutes);
app.use('/exams', examRoutes);
app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);
app.use('/students', studentRoutes);
app.use('/assignments', assignmentRoutes);

// Подключение базы данных и запуск сервера
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
