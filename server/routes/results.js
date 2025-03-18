const express = require('express');
const Result = require('../models/Result');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router(); // Создаем экземпляр Router

// Get all results (GET /api/results) - You might want to filter this by user or exam
router.get('/', authMiddleware, async (req, res) => {
  try {
    const results = await Result.findAll();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching results' });
  }
});

// Create a new result (POST /api/results)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { StudentID, ExamID, Score, DateTaken } = req.body;
    const result = await Result.create({ StudentID, ExamID, Score, DateTaken });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating result' });
  }
});

// Get a specific result by ID (GET /api/results/:id) - Consider using StudentID and ExamID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Result.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching result' });
  }
});

// Update an existing result (PUT /api/results/:id)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { StudentID, ExamID, Score, DateTaken } = req.body;
    const result = await Result.update({ StudentID, ExamID, Score, DateTaken }, { where: { ResultID: id } });
    if (result[0] === 0) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating result' });
  }
});

// Delete a result (DELETE /api/results/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Result.destroy({ where: { ResultID: id } });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting result' });
  }
});

module.exports = router; // Экспортируем router