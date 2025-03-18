const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Импортируем db
const Teacher = db.Teacher; // Получаем модель Teacher из db

router.post('/register', async (req, res) => {
  try {
    const { username, password, email, teacherName } = req.body;

    // Check if the username already exists
    const existingTeacher = await Teacher.findOne({ where: { username } });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = await Teacher.create({
      username,
      password: hashedPassword,
      email,
      TeacherName: teacherName
    });

    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Error creating teacher' });
  }
});

// Login (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await Teacher.findOne({ where: { Email } }); // Используем Teacher здесь
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.TeacherID, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'teacher' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;