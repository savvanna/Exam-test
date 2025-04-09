// client/src/components/Dashboard/StudentDashboard.jsx
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
  
  // Состояния для ручного выбора экзамена (selectExam, takeExam по активности учебного материала)
  const [exams, setExams] = useState([]); // список экзаменов (используется в режиме "selectExam")
  const [selectedExam, setSelectedExam] = useState(null); // детальная информация выбранного экзамена
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState('');
  const [answers, setAnswers] = useState({}); // {questionIndex: selectedOptionLetter}
  const [result, setResult] = useState(null);

  // Новые состояния для загруженных назначенных экзаменов (учебное задание, пришедшее от преподавателя)
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');

  // Данные студента из localStorage
  const studentName = localStorage.getItem('studentName') || 'Student Name';
  const studentEmail = localStorage.getItem('studentEmail') || 'student@example.com';
  const registrationDate = localStorage.getItem('registrationDate') || 'N/A';
  const groupName = localStorage.getItem('groupName') || 'Group';
  const role = localStorage.getItem('role') || 'student';
  // Необходимо сохранить также StudentID, если он передаётся при логине:
  const studentID = localStorage.getItem('studentID') || null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('registrationDate');
    localStorage.removeItem('groupName');
    localStorage.removeItem('studentID');
    navigate('/');
  };

  // При переходе в режим выбора экзамена (ручной выбор) получаем список экзаменов
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
      setActiveView('takeExam'); // Переключаемся в режим прохождения экзамена
    } catch (error) {
      console.error('Ошибка получения деталей экзамена:', error);
      setExamError('Ошибка загрузки выбранного экзамена');
      setActiveView('selectExam');
    }
  };

  // Сохраняем выбранный вариант ответа для конкретного вопроса
  // eslint-disable-next-line no-unused-vars
const handleAnswerChange = (questionIdx, option) => {
  setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
};

// eslint-disable-next-line no-unused-vars
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


  // При переключении на режим "takeExam" (назначенные экзамены), загружаем назначенные экзамены для студента
  useEffect(() => {
    if (activeView === 'takeExam' && studentID) {
      const fetchAssignments = async () => {
        setAssignmentsLoading(true);
        try {
          const baseURL =
            process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');
          // Запрос к API для получения назначенных экзаменов для данного студента:
          // Ожидается, что API GET /assignments?studentId=... возвращает массив объектов с полями:
          // assignmentId, examId, examTitle, assignedDate
          const response = await axios.get(`${baseURL}/assignments?studentId=${studentID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPendingAssignments(response.data);
          setAssignmentsError('');
        } catch (error) {
          console.error('Ошибка загрузки назначенных экзаменов:', error);
          setAssignmentsError('Ошибка загрузки назначенных экзаменов.');
        } finally {
          setAssignmentsLoading(false);
        }
      };
      fetchAssignments();
    }
  }, [activeView, studentID]);

  // Функция рендеринга содержимого в зависимости от activeView
  const renderContent = () => {
    if (activeView === 'profile') {
      return (
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
      return (
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
      // Если назначенных экзаменов есть, выводим их; если нет, можно показать назначённый экзамен, который мы получили через selectExam
      return (
        <div className="exam-container">
          <h2>Assigned Exams</h2>
          {assignmentsLoading ? (
            <p>Загрузка назначенных экзаменов...</p>
          ) : assignmentsError ? (
            <p className="error">{assignmentsError}</p>
          ) : pendingAssignments.length > 0 ? (
            <div className="assignments-section">
              <table className="assignments-table">
                <thead>
                  <tr>
                    <th>Exam Title</th>
                    <th>Assigned Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAssignments.map((assignment) => (
                    <tr key={assignment.assignmentId}>
                      <td>{assignment.examTitle}</td>
                      <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="submit-btn"
                          onClick={() => {
                            // Переход на страницу прохождения экзамена с передачей examId
                            navigate(`/take-exam?examId=${assignment.examId}`);
                          }}
                        >
                          Пройти экзамен
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Вам не назначены экзамены. Проверьте позже или выберите экзамен самостоятельно.</p>
          )}
          <button className="cancel-btn" onClick={() => setActiveView('profile')}>
            Назад к профилю
          </button>
        </div>
      );
    } else if (activeView === 'result') {
      return (
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
    return null;
  };

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
              {/* Изменяем ссылку Take Exam: переходим в режим assigned exams (takeExam) */}
              <Link to="#" onClick={() => setActiveView('takeExam')}>
                <FaClipboardList className="menu-icon" />
                <span>Take Exam</span>
                {pendingAssignments.length > 0 && (
                  <span className="badge">{pendingAssignments.length}</span>
                )}
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
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;
