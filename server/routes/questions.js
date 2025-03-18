const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router(); // Создаем экземпляр Router

// Get all questions (GET /api/questions)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Create a new question (POST /api/questions)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ExamID, QuestionType, QuestionText, CorrectAnswer, ImageURL } = req.body;
    const question = await Question.create({ ExamID, QuestionType, QuestionText, CorrectAnswer, ImageURL });
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Get a specific question by ID (GET /api/questions/:id)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Update an existing question (PUT /api/questions/:id)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { ExamID, QuestionType, QuestionText, CorrectAnswer, ImageURL } = req.body;
    const question = await Question.update({ ExamID, QuestionType, QuestionText, CorrectAnswer, ImageURL }, { where: { QuestionID: id } });
    if (question[0] === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// Delete a question (DELETE /api/questions/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.destroy({ where: { QuestionID: id } });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting question' });
  }
});

module.exports = router; // Экспортируем router