const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /assignments?studentId=...
router.get('/', async (req, res) => {
  const studentId = req.query.studentId;
  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }
  try {
    console.log('Received studentId:', studentId);
    const student = await db.Student.findByPk(studentId);
    console.log('Student record:', student);
    if (!student || !student.assignedExams || student.assignedExams.length === 0) {
      return res.json([]);
    }
    const exams = await db.Exam.findAll({
      where: {
        ExamID: student.assignedExams,
      },
    });
    res.json(exams);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

module.exports = router;
