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

  // Режимы: 'profile', 'allExams', 'assignedExams', 'result'
  const [activeView, setActiveView] = useState('profile');

  // Состояния для просмотра всех экзаменов (режим "Take Exam")
  const [exams, setExams] = useState([]);
  const [allExamLoading, setAllExamLoading] = useState(false);
  const [allExamError, setAllExamError] = useState('');

  // Состояния для просмотра назначённых экзаменов (режим "Assign Exam")
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');

  // Если планируется реализовывать дополнительную логику прохождения экзамена:
  // (пока не используется, но для блока "result" требуется переменная result)
  const [result, setResult] = useState(null);

  // Данные студента из localStorage
  const studentName = localStorage.getItem('studentName') || 'Student Name';
  const studentEmail = localStorage.getItem('studentEmail') || 'student@example.com';
  const registrationDate = localStorage.getItem('registrationDate') || 'N/A';
  const groupName = localStorage.getItem('groupName') || 'Group';
  const role = localStorage.getItem('role') || 'student';
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

  // Вспомогательная функция для форматирования даты
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  // Если выбран режим "allExams", запрашиваем все экзамены
  useEffect(() => {
    if (activeView === 'allExams') {
      const fetchAllExams = async () => {
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
      fetchAllExams();
    }
  }, [activeView]);

  // Если выбран режим "assignedExams", запрашиваем назначенные экзамены для студента
  useEffect(() => {
    if (activeView === 'assignedExams' && studentID) {
      const fetchAssignments = async () => {
        setAssignmentsLoading(true);
        try {
          const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');
          // Ожидается, что API GET /assignments?studentId=... возвращает массив объектов с полями: 
          // assignmentId, examId (или ExamID), examTitle (или Title) и assignedDate
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

  // Функция для перехода к прохождению экзамена по его examId
  const handleTakeExam = (examId) => {
    console.log('ExamId для прохождения:', examId);
    navigate(`/take-exam?examId=${examId}`);
  };

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
    } else if (activeView === 'allExams') {
      return (
        <div className="exam-container">
          <h2>Take Exam – Все экзамены</h2>
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
                    <th>Exam Title</th>
                    <th>Exam Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.ExamID}>
                      <td>{exam.Title}</td>
                      <td>{formatDate(exam.Date)}</td>
                      <td>
                        <button
                          className="submit-btn"
                          onClick={() => handleTakeExam(exam.ExamID)}
                        >
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
    } else if (activeView === 'assignedExams') {
      return (
        <div className="exam-container">
          <h2>Assign Exam – Назначенные экзамены</h2>
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
                    <tr
                      key={
                        assignment.assignmentId ||
                        `assignment-${assignment.examId || assignment.ExamID}`
                      }
                    >
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
              Вам не назначены экзамены. Проверьте позже или перейдите в раздел "Take Exam", чтобы выбрать экзамен самостоятельно.
            </p>
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
          <button className="cancel-btn" onClick={() => setActiveView('allExams')}>
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
              {/* Ссылка "Take Exam" – отображает список всех экзаменов */}
              <Link to="#" onClick={() => setActiveView('allExams')}>
                <FaClipboardList className="menu-icon" />
                <span>Take Exam</span>
              </Link>
            </li>
            <li>
              {/* Ссылка "Assign Exam" – отображает назначенные экзамены;
                  Количество выводим в скобках */}
              <Link to="#" onClick={() => setActiveView('assignedExams')}>
                <FaClipboardList className="menu-icon" />
                <span>Assign Exam {pendingAssignments.length > 0 && (<span className="badge">({pendingAssignments.length})</span>)}</span>
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
