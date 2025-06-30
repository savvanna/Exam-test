// server/routes/results.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /results
// При передаче teacherId возвращаем результаты экзаменов для преподавателя,
// а при передаче studentId – результаты для данного студента
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { teacherId, studentId } = req.query;
    let results;
    if (teacherId) {
      results = await db.Result.findAll({
        include: [
          {
            model: db.Student,
            as: 'student',  // обязательно используем alias "student"
            attributes: ['StudentName'],
          },
          {
            model: db.Exam,
            as: 'exam',     // обязательно используем alias "exam"
            attributes: ['Title', 'TeacherID'],
          },
        ],
        where: {
          '$exam.TeacherID$': teacherId,
        },
      });
      const transformed = results.map(result => ({
        ResultID: result.ResultID,
        StudentName: result.student ? result.student.StudentName : null,
        ExamTitle: result.exam ? result.exam.Title : null,
        Score: result.Score,
        Total: result.Total,
        DateTaken: result.DateTaken,
      }));
      return res.json(transformed);
    } else if (studentId) {
      results = await db.Result.findAll({
        where: { StudentID: studentId },
        include: [
          {
            model: db.Exam,
            as: 'exam',     // используем alias "exam"
            attributes: ['Title', 'TeacherID'],
            include: [
              {
                model: db.Teacher,
                as: 'teacher', // используем alias "teacher"
                attributes: ['TeacherName'],
              },
            ],
          },
        ],
      });
      const transformed = results.map(result => ({
        ResultID: result.ResultID,
        ExamTitle: result.exam ? result.exam.Title : null,
        TeacherName: result.exam && result.exam.teacher ? result.exam.teacher.TeacherName : null,
        Score: result.Score,
        Total: result.Total,
        DateTaken: result.DateTaken,
      }));
      return res.json(transformed);
    } else {
      results = await db.Result.findAll();
      return res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching results' });
  }
});

// Остальные маршруты (POST, GET /:id, PUT, DELETE) оставляем без изменений

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { StudentID, ExamID, Score, Total, DateTaken } = req.body;
    const result = await db.Result.create({ StudentID, ExamID, Score, Total, DateTaken });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating result' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.Result.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching result' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { StudentID, ExamID, Score, Total, DateTaken } = req.body;
    const updated = await db.Result.update(
      { StudentID, ExamID, Score, Total, DateTaken },
      { where: { ResultID: id } }
    );
    if (updated[0] === 0) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating result' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.Result.destroy({ where: { ResultID: id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting result' });
  }
});

module.exports = router;
