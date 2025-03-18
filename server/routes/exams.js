const express = require('express');
const Exam = require('../models/Exam');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all exams (GET /api/exams)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.findAll({ include: 'Teacher' });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching exams' });
  }
});

// Create a new exam (POST /api/exams)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { Title, Date, TeacherID } = req.body;
    const exam = await Exam.create({ Title, Date, TeacherID });
    res.status(201).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating exam' });
  }
});

// Get a specific exam by ID (GET /api/exams/:id)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id, { include: 'Teacher' });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching exam' });
  }
});

// Update an existing exam (PUT /api/exams/:id)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { Title, Date, TeacherID } = req.body;
    const exam = await Exam.update({ Title, Date, TeacherID }, { where: { ExamID: id } });
    if (exam[0] === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating exam' });
  }
});

// Delete an exam (DELETE /api/exams/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.destroy({ where: { ExamID: id } });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting exam' });
  }
});

module.exports = router;