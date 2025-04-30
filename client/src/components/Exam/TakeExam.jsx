// client/src/components/TakeExam.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateExam.css';

const TakeExam = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Извлекаем examId из query-параметров, например: /take-exam?examId=123
  const examId = new URLSearchParams(location.search).get('examId');

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); // {questionIndex: selectedOptionLetter}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        // Получаем детальную информацию об экзамене по его id
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctCount = 0;
    // Обрабатываем оба варианта именования поля с вопросами: Questions или questions
    const questions = exam?.Questions || exam?.questions || [];
    questions.forEach((q, idx) => {
      if (answers[idx] === q.CorrectAnswer) {
        correctCount++;
      }
    });
    setResult({ score: correctCount, total: questions.length });
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

  // Используем вопросы из экзамена (поддерживая оба варианта именования)
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
            Вернуться в профиль
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
              {/* Если преподаватель загрузил изображение для вопроса, отображаем его */}
              {(q.Image || q.image) && (
                <div className="question-image">
                  <img
                    src={q.Image || q.image}
                    alt={`Изображение для вопроса ${idx + 1}`}
                    style={{ maxWidth: '400px', display: 'block', margin: '10px auto' }}
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
