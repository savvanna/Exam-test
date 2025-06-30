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
    // Загружаем экзамены, назначенные студенту, и включаем данные преподавателя
    const exams = await db.Exam.findAll({
      where: {
        ExamID: student.assignedExams,
      },
      include: [
        {
          model: db.Teacher,
          as: 'teacher', // alias должен совпадать с тем, что задан в модели Exam
          attributes: ['TeacherName']
        }
      ]
    });
    // Преобразуем полученные данные для удобства отображения на клиенте
    const transformedExams = exams.map(exam => ({
      ExamID: exam.ExamID,
      Title: exam.Title,
      Date: exam.Date,  // Дата экзамена
      TeacherName: exam.teacher ? exam.teacher.TeacherName : 'N/A'
    }));
    res.json(transformedExams);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

module.exports = router;
