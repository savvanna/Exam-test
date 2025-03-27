const express = require('express');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

// Маршрут для получения списка экзаменов (требует аутентификации)
router.get('/exams', authMiddleware, (req, res) => {
  // Здесь будет код для получения списка экзаменов из базы данных
  // Доступ к userId и userRole: req.userId, req.userRole
  res.json({ message: 'List of exams for teacher', userId: req.userId, userRole: req.userRole });
});

// Маршрут для создания нового экзамена (требует аутентификации)
router.post('/exams', authMiddleware, (req, res) => {
  // Здесь будет код для создания нового экзамена в базе данных
  // Доступ к userId и userRole: req.userId, req.userRole
  res.json({ message: 'Create a new exam', userId: req.userId, userRole: req.userRole });
});

// Открытый маршрут (не требует аутентификации) - пример
router.get('/public-info', (req, res) => {
  res.json({ message: 'Public information about teachers' });
});

module.exports = router;