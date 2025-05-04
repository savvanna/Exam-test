// server/routes/exams.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models');

// Импорт моделей из объекта db
const Teacher = db.Teacher;
const Exam = db.Exam;
const Question = db.Question;

// GET /exams - получение списка экзаменов (без деталей)
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.json(exams);
  } catch (error) {
    console.error('Error retrieving exams:', error);
    res.status(500).json({ message: 'Error retrieving exams', error: error.message });
  }
});

// GET /exams/:examId - получение экзамена с вопросами (детальная информация)
router.get('/:examId', async (req, res) => {
  try {
    const exam = await Exam.findOne({
      where: { ExamID: req.params.examId },
      include: [
        {
          model: Question,
          as: 'questions', // имя alias должно совпадать с определением ассоциации
        },
      ],
    });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
});

// POST /exams - простой режим создания экзамена без вопросов
router.post('/', authMiddleware, async (req, res) => {
  console.log('Received exam data:', req.body);
  try {
    const { Title, Date } = req.body;
    const TeacherID = req.userId; // authMiddleware должен устанавливать req.userId

    // Проверка существования преподавателя
    const teacher = await Teacher.findByPk(TeacherID);
    if (!teacher) {
      console.error(`Teacher with id ${TeacherID} not found.`);
      return res.status(400).json({ message: 'Teacher not found.' });
    }

    const exam = await Exam.create({ Title, Date, TeacherID });
    console.log('Exam created:', exam);
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
});

// POST /exams/detailed - детальное создание экзамена с вопросами
// POST /exams/detailed - детальное создание экзамена с вопросами
router.post('/detailed', authMiddleware, async (req, res) => {
  const { Title, Date, Questions } = req.body;
  if (!Title || !Date || !Array.isArray(Questions) || Questions.length === 0) {
    return res.status(400).json({ message: 'Title, Date and at least one question are required.' });
  }

  const TeacherID = req.userId; // authMiddleware должен устанавливать req.userId
  const teacher = await Teacher.findByPk(TeacherID);
  if (!teacher) {
    return res.status(400).json({ message: 'Teacher not found.' });
  }

  // Транзакция для атомарности операции
  const transaction = await db.sequelize.transaction();
  try {
    const exam = await Exam.create({ Title, Date, TeacherID }, { transaction });

    const createdQuestions = [];
    for (let i = 0; i < Questions.length; i++) {
      const q = Questions[i];
      // Проверяем обязательные поля
      if (!q.Text || !q.Type || !q.Answers || !q.CorrectAnswer) {
        await transaction.rollback();
        return res.status(400).json({ message: `Question ${i + 1} is missing required fields.` });
      }
      // Включаем поле Image, если оно есть. Если его нет, передаём null.
      const question = await Question.create(
        {
          ExamID: exam.ExamID,
          Text: q.Text,
          Type: q.Type,
          Answers: q.Answers,
          CorrectAnswer: q.CorrectAnswer,
          Image: q.Image || null,
        },
        { transaction }
      );
      createdQuestions.push(question);
    }
    await transaction.commit();
    res.status(201).json({
      message: 'Exam and questions created successfully',
      exam,
      questions: createdQuestions,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating detailed exam:', error);
    res.status(500).json({ message: 'Error creating detailed exam', error: error.message });
  }
});


// POST /exams/assign - назначение экзамена студентам
router.post('/assign', authMiddleware, async (req, res) => {
  const { examId, studentIds } = req.body;

  if (!examId || !studentIds || studentIds.length === 0) {
    return res.status(400).json({ message: 'Exam ID and at least one student ID are required.' });
  }

  try {
    await Promise.all(
      studentIds.map(async (studentId) => {
        const student = await db.Student.findByPk(studentId);
        if (student) {
          const updatedExams = student.assignedExams
            ? [...student.assignedExams, examId]
            : [examId];
          await student.update({ assignedExams: updatedExams });
          // Дополнительный лог для проверки
          const updatedStudent = await student.reload();
          console.log(`Student ${studentId} assignedExams:`, updatedStudent.assignedExams);
        }
      })
    );

    res.status(201).json({ message: 'Exam successfully assigned to students.' });
  } catch (error) {
    console.error('Error assigning exam:', error);
    res.status(500).json({ message: 'Error assigning exam', error: error.message });
  }
});


module.exports = router;
