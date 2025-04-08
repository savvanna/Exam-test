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
          as: 'questions', // обязательно со строчной буквы, совпадает с определением ассоциации
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
router.post('/detailed', authMiddleware, async (req, res) => {
  /*
    Ожидаемый формат запроса (JSON):
    {
      "Title": "Название экзамена",
      "Date": "2025-04-05",
      "Questions": [
         {
            "Text": "Вопрос 1: Какой цвет у светофора?",
            "Type": "multiple-choice",
            "Answers": {
                "A": "Красный",
                "B": "Зелёный",
                "C": "Жёлтый",
                "D": "Синий"
            }
         },
         ...
      ]
    }
  */
  const { Title, Date, Questions } = req.body;
  if (!Title || !Date || !Array.isArray(Questions) || Questions.length === 0) {
    return res.status(400).json({ message: 'Title, Date and at least one question are required.' });
  }

  const TeacherID = req.userId;
  const teacher = await Teacher.findByPk(TeacherID);
  if (!teacher) {
    return res.status(400).json({ message: 'Teacher not found.' });
  }

  // Запускаем транзакцию для атомарного выполнения операций
  const transaction = await db.sequelize.transaction();
  try {
    const exam = await Exam.create({ Title, Date, TeacherID }, { transaction });

    const createdQuestions = [];
    for (let i = 0; i < Questions.length; i++) {
      const q = Questions[i];
      if (!q.Text || !q.Type || !q.Answers) {
        await transaction.rollback();
        return res.status(400).json({ message: `Question ${i + 1} is missing required fields.` });
      }
      const question = await Question.create(
        {
          ExamID: exam.ExamID,
          Text: q.Text,
          Type: q.Type,
          Answers: q.Answers
        },
        { transaction }
      );
      createdQuestions.push(question);
    }
    await transaction.commit();
    res.status(201).json({
      message: 'Exam and questions created successfully',
      exam,
      questions: createdQuestions
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating detailed exam:', error);
    res.status(500).json({ message: 'Error creating detailed exam', error: error.message });
  }
});

module.exports = router;
