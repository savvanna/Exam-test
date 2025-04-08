import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateExam.css';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
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
        // Запрашиваем детальную информацию об экзамене по его id
        const response = await axios.get(`${baseURL}/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка получения экзамена:', err);
        setError('Ошибка загрузки экзамена');
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  const handleAnswerChange = (questionIdx, option) => {
    setAnswers({ ...answers, [questionIdx]: option });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctCount = 0;
    exam.Questions.forEach((q, idx) => {
      if (answers[idx] === q.CorrectAnswer) {
        correctCount += 1;
      }
    });
    setResult({ score: correctCount, total: exam.Questions.length });
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
          {exam.Questions.map((q, idx) => (
            <div key={idx} className="question-block">
              <div className="question-header">
                <h4>Вопрос {idx + 1}</h4>
              </div>
              <div className="form-group">
                <label>Текст вопроса:</label>
                <p>{q.Text}</p>
              </div>
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
