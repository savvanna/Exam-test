// server/routes/authTeacher.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models');
const Teacher = db.Teacher;

router.post('/register', async (req, res) => {
  console.log('[Teacher Register]', req.body);
  try {
    const { username, password, Email, TeacherName } = req.body;
    const existingTeacher = await Teacher.findOne({ where: { username } });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (!password || !Email || !TeacherName) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = await Teacher.create({
      username,
      Password: hashedPassword,
      Email,
      TeacherName,
    });
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Error creating teacher' });
  }
});

router.post('/login', async (req, res) => {
  console.log('[Teacher Login]', req.body);
  try {
    const { Email, Password } = req.body;
    const user = await Teacher.findOne({ where: { Email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.TeacherID, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, role: 'teacher' });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
