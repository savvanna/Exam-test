// client/src/components/TakeExam.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateExam.css';

const TakeExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examId = new URLSearchParams(location.search).get('examId');

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched exam:", response.data);
        setExam(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка получения экзамена:', err);
        setError('Ошибка загрузки экзамена');
        setLoading(false);
      }
    };
    if (examId) {
      fetchExam();
    } else {
      setError('Не задан examId');
      setLoading(false);
    }
  }, [examId]);

  const handleAnswerChange = (questionIdx, option) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
    console.log(`Ответ на вопрос ${questionIdx + 1} выбран: ${option}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correctCount = 0;
    const questions = exam?.Questions || exam?.questions || [];
    
    questions.forEach((q, idx) => {
      // Приводим выбранный ответ и правильный ответ к строке, обрезаем пробелы и переводим в верхний регистр
      const userAnswer = (answers[idx] || '').toString().trim().toUpperCase();
      const correctAnswer = (q.CorrectAnswer || '').toString().trim().toUpperCase();

      console.log(`Вопрос ${idx + 1}: выбранный ответ: "${userAnswer}" | ожидаемый: "${correctAnswer}"`);

      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });
    
    console.log(`Подсчитано ${correctCount} правильных ответов из ${questions.length}`);
    setResult({ score: correctCount, total: questions.length });

    // Отправляем результат на сервер
    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const payload = {
        StudentID: localStorage.getItem('studentID'),
        ExamID: exam.ExamID,
        Score: correctCount,
        Total: questions.length,
        DateTaken: new Date(),
      };
      const response = await axios.post(`${baseURL}/results`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Result created:', response.data);
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  if (loading) {
    return (
      <div className="exam-container">
        <p>Загрузка экзамена...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  const questions = exam?.Questions || exam?.questions || [];
  console.log("Exam Questions:", questions);

  return (
    <div className="exam-container">
      <h2>{exam.Title}</h2>
      <p>
        <strong>Дата экзамена:</strong> {new Date(exam.Date).toLocaleDateString()}
      </p>
      {result ? (
        <div className="result">
          <h3>Результат экзамена</h3>
          <p>
            Вы ответили правильно на {result.score} из {result.total} вопросов.
          </p>
          <button
            type="button"
            className="submit-btn"
            onClick={() => navigate('/student-dashboard')}
          >
            Вернуться к профилю
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="exam-form">
          {questions.map((q, idx) => (
            <div key={idx} className="question-block">
              <div className="question-header">
                <h4>Вопрос {idx + 1}</h4>
              </div>
              <div className="form-group">
                <label>Текст вопроса:</label>
                <p>{q.Text}</p>
              </div>
              {(q.Image || q.image) && (
                <div className="question-image">
                  <img
                    src={q.Image || q.image}
                    alt={`Изображение для вопроса ${idx + 1}`}
                    style={{ maxWidth: '400px', display: 'block', margin: '10px auto', borderRadius: '4px' }}
                  />
                </div>
              )}
              <div className="answers-section">
                <h5>Варианты ответов</h5>
                {Object.entries(q.Answers).map(([letter, answerText]) => (
                  <div key={letter} className="answer-option">
                    <label>
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={letter}
                        checked={answers[idx] === letter}
                        onChange={() => handleAnswerChange(idx, letter)}
                      />
                      {letter}. {answerText}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Завершить экзамен
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TakeExam;
