// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../models'); // Импортируем db
// const Teacher = db.Teacher; // Получаем модель Teacher из db

// router.post('/register', async (req, res) => {
//   console.log(req.body);
//   try {
//     const { username, password, Email, TeacherName } = req.body; // Используем "Email" и "TeacherName" с большой буквы

//     // Check if the username already exists
//     const existingTeacher = await Teacher.findOne({ where: { username } });
//     if (existingTeacher) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     // Check if password is valid
//     if (!password) {
//       return res.status(400).json({ message: 'Password is required' });
//     }

//     // Check if Email and TeacherName are valid
//     if (!Email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }
//     if (!TeacherName) {
//       return res.status(400).json({ message: 'TeacherName is required' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new teacher
//     const newTeacher = await Teacher.create({
//       username: username,
//       Password: hashedPassword,
//       Email: Email, // Используем "Email" с большой буквы
//       TeacherName: TeacherName // Используем "TeacherName" с большой буквы
//     });

//     res.status(201).json({ message: 'Teacher created successfully' });
//   } catch (error) {
//     console.error('Error creating teacher:', error);
//     res.status(500).json({ message: 'Error creating teacher' });
//   }
// });


// router.post('/login', async (req, res) => {
//   console.log('Defining /auth/login route');
//   console.log(req.body)
//   try {
//     const { Email, Password } = req.body; // Убедитесь, что поле называется Email
//     const user = await Teacher.findOne({ where: { Email } });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const passwordMatch = await bcrypt.compare(Password, user.Password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user.TeacherID, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, role: 'teacher' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error logging in' });
//   }
// });

// module.exports = router;