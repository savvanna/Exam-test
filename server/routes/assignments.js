// server/routes/assignments.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const Assignment = db.Assignment; // убедитесь, что модель импортирована
const Student = db.Student; // если требуется

// GET /assignments?studentId=...
router.get('/', async (req, res) => {
  const studentId = req.query.studentId;
  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }
  try {
    // Получаем все назначенные экзамены для данного студента
    // Можно добавить include, чтобы получить данные экзамена
    const assignments = await Assignment.findAll({
      where: { StudentID: studentId },
      include: [
        {
          model: db.Exam,
          as: 'exam',
          attributes: ['ExamID', 'Title', 'Date']
        }
      ]
    });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

module.exports = router;
