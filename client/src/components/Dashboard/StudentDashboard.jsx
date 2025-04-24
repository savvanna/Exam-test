// client/src/components/Dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBook
} from 'react-icons/fa';
import axios from 'axios';
import ModuleTests from '../ModuleTests/ModuleTests'; // Убедитесь, что этот путь корректный
import '../../styles/Dashboard.css';
import '../../styles/CreateExam.css';

const StudentDashboard = ({ setAuth }) => {
  const navigate = useNavigate();

  // activeView: 'profile', 'allExams', 'assignedExams', 'modules', 'result'
  const [activeView, setActiveView] = useState('profile');

  const [exams, setExams] = useState([]);
  const [allExamLoading, setAllExamLoading] = useState(false);
  const [allExamError, setAllExamError] = useState('');

  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');

  // Если используется результат экзамена (пока не применён)
  // eslint-disable-next-line no-unused-vars
  const [result, setResult] = useState(null);

  // Данные студента из localStorage
  const studentName = localStorage.getItem('studentName') || 'Student Name';
  const studentEmail = localStorage.getItem('studentEmail') || 'student@example.com';
  const registrationDate = localStorage.getItem('registrationDate') || 'N/A';
  const groupName = localStorage.getItem('groupName') || 'Group';
  const role = localStorage.getItem('role') || 'student';
  const studentID = localStorage.getItem('studentID') || null;

  const navigateWithView = (view) => {
    setActiveView(view);
  };

  // Вспомогательная функция для форматирования даты
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  // Функция logout: очищает localStorage, обновляет auth и переходит на главную страницу
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('registrationDate');
    localStorage.removeItem('groupName');
    localStorage.removeItem('studentID');
    if (setAuth) setAuth({ token: null, role: null });
    navigate('/');
  };

  // Загрузка всех экзаменов при выборе "allExams"
  useEffect(() => {
    if (activeView === 'allExams') {
      const fetchExams = async () => {
        setAllExamLoading(true);
        try {
          const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');
          const response = await axios.get(`${baseURL}/exams`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setExams(response.data);
          setAllExamError('');
        } catch (error) {
          console.error('Ошибка получения всех экзаменов:', error);
          setAllExamError('Ошибка загрузки экзаменов');
        } finally {
          setAllExamLoading(false);
        }
      };
      fetchExams();
    }
  }, [activeView]);

  // Загрузка назначенных экзаменов при выборе "assignedExams"
  useEffect(() => {
    if (activeView === 'assignedExams' && studentID) {
      const fetchAssignments = async () => {
        setAssignmentsLoading(true);
        try {
          const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');
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

  // Переход к прохождению экзамена
  const handleTakeExam = (examId) => {
    navigate(`/take-exam?examId=${examId}`);
  };

  // Рендеринг содержимого правой части в зависимости от activeView
  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <div>
            <h2>Кабинет Студента</h2>
            <p>
              Добро пожаловать, {studentName}!
            </p>
            <ul>
              <li><strong>Email:</strong> {studentEmail}</li>
              <li><strong>Дата регистрации</strong> {registrationDate}</li>
              <li><strong>Номер группы</strong> {groupName}</li>
            </ul>
          </div>
        );
      case 'allExams':
        return (
          <div className="exam-container">
            <h2>Пройти экзамен – Все экзамены</h2>
            {allExamLoading ? (
              <p>Загрузка экзаменов...</p>
            ) : allExamError ? (
              <p className="error">{allExamError}</p>
            ) : exams.length === 0 ? (
              <p>Нет доступных экзаменов</p>
            ) : (
              <div className="assignments-section">
                <table className="assignments-table">
                  <thead>
                    <tr>
                    <th>Название экзамена</th>
                      <th>Дата проведения</th>
                      <th>Прохождение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam.ExamID}>
                        <td>{exam.Title}</td>
                        <td>{formatDate(exam.Date)}</td>
                        <td>
                          <button className="submit-btn" onClick={() => handleTakeExam(exam.ExamID)}>
                            Пройти экзамен
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className="cancel-btn" onClick={() => setActiveView('profile')}>
              Назад к профилю
            </button>
          </div>
        );
      case 'assignedExams':
        return (
          <div className="exam-container">
            <h2>Пройти экзамен – Назначенные экзамены</h2>
            {assignmentsLoading ? (
              <p>Загрузка назначенных экзаменов...</p>
            ) : assignmentsError ? (
              <p className="error">{assignmentsError}</p>
            ) : pendingAssignments.length > 0 ? (
              <div className="assignments-section">
                <table className="assignments-table">
                  <thead>
                    <tr>
                      <th>Название экзамена</th>
                      <th>Дата проведения</th>
                      <th>Прохождение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAssignments.map((assignment) => (
                      <tr key={assignment.assignmentId || `assignment-${assignment.examId || assignment.ExamID}`}>
                        <td>{assignment.examTitle || assignment.Title}</td>
                        <td>{formatDate(assignment.assignedDate)}</td>
                        <td>
                          <button
                            className="submit-btn"
                            onClick={() =>
                              handleTakeExam(assignment.examId || assignment.ExamID)
                            }
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
              <p>
                Вам не назначены экзамены. Проверьте позже или перейдите в раздел "Take Exam" для выбора экзамена.
              </p>
            )}
            <button className="cancel-btn" onClick={() => setActiveView('profile')}>
              Назад к профилю
            </button>
          </div>
        );
      case 'modules':
        return (
          // Отображение страницы модуль-тестов
          <div className="modules-container" style={{ backgroundColor: '#fff', padding: '20px', minHeight: '100vh' }}>
            <ModuleTests />
          </div>
        );
      case 'result':
        return (
          <div className="exam-container">
            <h2>Результат экзамена</h2>
            <p>
              Вы ответили правильно на {result.score} из {result.total} вопросов.
            </p>
            <button className="submit-btn" onClick={() => setActiveView('profile')}>
              Вернуться к профилю
            </button>
            <button className="cancel-btn" onClick={() => setActiveView('allExams')}>
              Выбрать другой экзамен
            </button>
          </div>
        );
      default:
        return null;
    }
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
                <span>Профиль</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('allExams')}>
                <FaClipboardList className="menu-icon" />
                <span>Пройти экзамен</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('assignedExams')}>
                <FaClipboardList className="menu-icon" />
                <span>
                  Назначенный экзамен {pendingAssignments.length > 0 && (<span className="badge">({pendingAssignments.length})</span>)}
                </span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('modules')}>
                <FaBook className="menu-icon" />
                <span>Специальные модули</span>
              </Link>
            </li>
            <li>
              <Link to="/student-settings">
                <FaCog className="menu-icon" />
                <span>Настройки</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          <span>Выйти</span>
        </div>
      </aside>
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;
