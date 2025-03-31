// server/routes/authStudent.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models');
const Student = db.Student;

router.post('/register', async (req, res) => {
  console.log('[Student Register]', req.body);
  try {
    const { username, password, Email, StudentName } = req.body;
    const existingStudent = await Student.findOne({ where: { username } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (!password || !Email || !StudentName) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await Student.create({
      username,
      Password: hashedPassword,
      Email,
      StudentName,
    });
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student' });
  }
});

router.post('/login', async (req, res) => {
  console.log('[Student Login]', req.body);
  try {
    const { Email, Password } = req.body;
    const student = await Student.findOne({ where: { Email } });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(Password, student.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: student.StudentID, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, role: 'student' });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
