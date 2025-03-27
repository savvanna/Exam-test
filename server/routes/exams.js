const express = require('express');
const Exam = require('../models/Exam');
const Teacher = require('../models/Teacher');
const Question = require('../models/Question'); // Import the Question model
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Маршрут для создания нового экзамена (требует аутентификации)
router.post('/exams', authMiddleware, async (req, res) => {
  try {
    const { Title, Date } = req.body;
    const TeacherID = req.userId; // Assuming req.userId contains the teacher's ID

    // Check if the teacher exists
    const teacher = await Teacher.findByPk(TeacherID);
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found.' });
    }

    const exam = await Exam.create({
      Title,
      Date,
      TeacherID,
    });

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
});

module.exports = router;