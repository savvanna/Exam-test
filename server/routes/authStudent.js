const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models');
const Student = db.Student;

router.post('/register', async (req, res) => {
  console.log('[Student Register]', req.body);
  try {
    // Из запроса берем поля
    const { password, Email, StudentName, groupName } = req.body;
    const existingStudent = await Student.findOne({ where: { Email } });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }
    if (!password || !Email || !StudentName) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await Student.create({
      Password: hashedPassword,
      Email,
      StudentName,
      groupName,
    });
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
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
    // Формируем JWT с идентификатором студента
    const token = jwt.sign(
      { id: student.StudentID, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Возвращаем все необходимые данные, включая StudentID
    res.json({
      token,
      role: 'student',
      studentID: student.StudentID, // именно small-case значение, чтобы на клиенте сохранить как "studentID"
      StudentName: student.StudentName,
      Email: student.Email,
      RegistrationDate: student.RegistrationDate,
      groupName: student.groupName  // имя поля соответствует модели
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
