import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import '../../styles/Dashboard.css';
import '../../styles/CreateExam.css';

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Режимы: 'profile', 'selectExam', 'takeExam', 'result'
  const [activeView, setActiveView] = useState('profile');
  const [exams, setExams] = useState([]); // список экзаменов из сервера
  const [selectedExam, setSelectedExam] = useState(null); // детальная информация выбранного экзамена
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState('');
  const [answers, setAnswers] = useState({}); // {questionIndex: selectedOptionLetter}
  const [result, setResult] = useState(null);

  // Данные студента из localStorage
  const studentName = localStorage.getItem('studentName') || 'Student Name';
  const studentEmail = localStorage.getItem('studentEmail') || 'student@example.com';
  const registrationDate = localStorage.getItem('registrationDate') || 'N/A';
  const groupName = localStorage.getItem('groupName') || 'Group';
  const role = localStorage.getItem('role') || 'student';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('registrationDate');
    localStorage.removeItem('groupName');
    navigate('/');
  };

  // При переходе в режим выбора экзамена получаем список экзаменов
  useEffect(() => {
    if (activeView === 'selectExam') {
      const fetchExams = async () => {
        try {
          const baseURL =
            process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');
          const response = await axios.get(`${baseURL}/exams`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setExams(response.data);
          setExamError('');
        } catch (err) {
          console.error('Ошибка получения экзаменов:', err);
          setExamError('Ошибка загрузки экзаменов');
        } finally {
          setExamLoading(false);
        }
      };
      setExamLoading(true);
      fetchExams();
    }
  }, [activeView]);

  // При выборе экзамена происходит дополнительный запрос для получения деталей (с вопросами)
  const handleSelectExam = async (exam) => {
    try {
      const baseURL =
        process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/exams/${exam.ExamID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Используем правильное имя поля 'questions', как возвращает сервер.
      const detailedExam = { ...response.data, questions: response.data.questions || [] };
      setSelectedExam(detailedExam);
      setAnswers({});
      setResult(null);
      setActiveView('takeExam');
    } catch (error) {
      console.error('Ошибка получения деталей экзамена:', error);
      setExamError('Ошибка загрузки выбранного экзамена');
      setActiveView('selectExam');
    }
  };

  // Сохраняем выбранный вариант ответа для конкретного вопроса
  const handleAnswerChange = (questionIdx, option) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  // Обработка завершения экзамена: сверяем ответы студента с правильными
  const handleExamSubmit = (e) => {
    e.preventDefault();
    if (!selectedExam || !selectedExam.questions) {
      return;
    }
    let correctCount = 0;
    selectedExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.CorrectAnswer) {
        correctCount++;
      }
    });
    setResult({ score: correctCount, total: selectedExam.questions.length });
    setActiveView('result');
  };

  // Отображаем разное содержимое в зависимости от режима
  let mainContent = null;
  if (activeView === 'profile') {
    mainContent = (
      <div>
        <h2>Student Profile</h2>
        <p>
          Welcome, {studentName}! This is your profile page where you can view your exam history, progress, and personal details.
        </p>
        <ul>
          <li><strong>Email:</strong> {studentEmail}</li>
          <li><strong>Registration Date:</strong> {registrationDate}</li>
          <li><strong>Group:</strong> {groupName}</li>
        </ul>
      </div>
    );
  } else if (activeView === 'selectExam') {
    mainContent = (
      <div className="exam-container">
        <h2>Выберите экзамен для прохождения</h2>
        {examLoading ? (
          <p>Загрузка экзаменов...</p>
        ) : examError ? (
          <p className="error">{examError}</p>
        ) : exams.length === 0 ? (
          <p>Нет доступных экзаменов</p>
        ) : (
          <ul className="exam-list">
            {exams.map((exam) => (
              <li key={exam.ExamID} className="exam-item">
                <h3>{exam.Title}</h3>
                <p><strong>Дата:</strong> {new Date(exam.Date).toLocaleDateString()}</p>
                <button className="submit-btn" onClick={() => handleSelectExam(exam)}>
                  Пройти экзамен
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className="cancel-btn" onClick={() => setActiveView('profile')}>
          Назад к профилю
        </button>
      </div>
    );
  } else if (activeView === 'takeExam') {
    mainContent = (
      <div className="exam-container">
        <h2>{selectedExam.Title}</h2>
        <p>
          <strong>Дата экзамена:</strong> {new Date(selectedExam.Date).toLocaleDateString()}
        </p>
        <form onSubmit={handleExamSubmit} className="exam-form">
          {selectedExam.questions && selectedExam.questions.length > 0 ? (
            selectedExam.questions.map((q, idx) => (
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
                  {q.Answers && Object.entries(q.Answers).map(([letter, text]) => (
                    <div key={letter} className="answer-option">
                      <label>
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={letter}
                          checked={answers[idx] === letter}
                          onChange={() => handleAnswerChange(idx, letter)}
                        />
                        {letter}. {text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>В этом экзамене пока нет вопросов.</p>
          )}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Завершить экзамен
            </button>
          </div>
        </form>
        <button className="cancel-btn" onClick={() => setActiveView('selectExam')}>
          Назад к экзаменам
        </button>
      </div>
    );
  } else if (activeView === 'result') {
    mainContent = (
      <div className="exam-container">
        <h2>Результат экзамена</h2>
        <p>
          Вы ответили правильно на {result.score} из {result.total} вопросов.
        </p>
        <button className="submit-btn" onClick={() => setActiveView('profile')}>
          Вернуться в профиль
        </button>
        <button className="cancel-btn" onClick={() => setActiveView('selectExam')}>
          Выбрать другой экзамен
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-info">
          <Link to="#" onClick={() => setActiveView('profile')}>
            <FaUser size={40} />
          </Link>
          <div className="profile-text">
            <Link to="#" onClick={() => setActiveView('profile')} className="user-link">
              <span className="user-name">{studentName}</span>
            </Link>
            <span className="user-role">
              ({role.charAt(0).toUpperCase() + role.slice(1)})
            </span>
          </div>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li>
              <Link to="#" onClick={() => setActiveView('profile')}>
                <FaHome className="menu-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('profile')}>
                <FaUser className="menu-icon" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('selectExam')}>
                <FaClipboardList className="menu-icon" />
                <span>Take Exam</span>
              </Link>
            </li>
            <li>
              <Link to="/student-settings">
                <FaCog className="menu-icon" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          <span>Logout</span>
        </div>
      </aside>
      <main className="dashboard-content">
        {mainContent}
      </main>
    </div>
  );
};

export default StudentDashboard;
