// server/routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Предполагается, что в объекте db есть модель Student
const Student = db.Student;

router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

module.exports = router;
