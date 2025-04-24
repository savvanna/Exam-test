// client/src/components/Dashboard/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaBook, FaCog, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import CreateExamForm from '../Exam/CreateExam';
import '../../styles/Dashboard.css';
import '../../styles/CreateExam.css';

const TeacherDashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  // activeView: "profile", "createExam" или "students"
  const [activeView, setActiveView] = useState('profile');

  // Состояния для списка студентов
  const [studentsData, setStudentsData] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');
  // Список выбранных студентов (их ID), например, через чекбоксы
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Состояния для экзамена, который назначается
  const [availableExams, setAvailableExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  // Состояние для показа сообщения (alert) после назначения экзамена
  const [assignmentMessage, setAssignmentMessage] = useState(null);

  // Состояние сортировки по колонке "Group"
  const [groupSortOrder, setGroupSortOrder] = useState('asc'); // 'asc' или 'desc'

  // Извлекаем данные преподавателя из localStorage
  const teacherName = localStorage.getItem('teacherName') || 'Teacher Name';
  const teacherEmail = localStorage.getItem('teacherEmail') || 'teacher@example.com';
  const role = localStorage.getItem('role') || 'teacher';

  // Обновлённая функция logout: очищает localStorage, сбрасывает динамичный state и делает навигацию
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherEmail');
    localStorage.removeItem('subject');
    localStorage.removeItem('teacherID');
    setAuth({ token: null, role: null }); // обновляем динамичное состояние аутентификации
    navigate('/'); // перенаправляем на главную страницу (где будет окно авторизации)
  };

  const handleExamCreated = (exam) => {
    console.log('Exam created:', exam);
    setActiveView('profile');
  };

  // При переключении на view "students" загружаем список студентов и доступных экзаменов
  useEffect(() => {
    if (activeView === 'students') {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Функция для загрузки студентов
      const fetchStudents = async () => {
        setStudentsLoading(true);
        try {
          const response = await axios.get(`${baseURL}/students`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudentsData(response.data);
          setStudentsError('');
        } catch (error) {
          console.error('Error fetching students:', error);
          setStudentsError('Ошибка загрузки списка студентов.');
        } finally {
          setStudentsLoading(false);
        }
      };

      // Функция для загрузки доступных экзаменов
      const fetchExams = async () => {
        try {
          const response = await axios.get(`${baseURL}/exams`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAvailableExams(response.data);
        } catch (error) {
          console.error('Error fetching exams:', error);
        }
      };

      fetchStudents();
      fetchExams();
    }
  }, [activeView]);
  
  // Функция для переключения выбранности студента по чекбоксу
  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Переключение сортировки по колонке группы
  const toggleGroupSort = () => {
    setGroupSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Получаем отсортированный список студентов по группе
  const sortedStudents = studentsData.slice().sort((a, b) => {
    const groupA = a.groupName || '';
    const groupB = b.groupName || '';
    return groupSortOrder === 'asc'
      ? groupA.localeCompare(groupB, undefined, { numeric: true })
      : groupB.localeCompare(groupA, undefined, { numeric: true });
  });

  // Обработка назначения экзамена
  const handleAssignExam = async () => {
    if (!selectedExam) {
      setAssignmentMessage({ type: 'error', text: 'Пожалуйста, выберите экзамен для назначения.' });
      return;
    }
    if (selectedStudents.length === 0) {
      setAssignmentMessage({ type: 'error', text: 'Пожалуйста, выберите хотя бы одного студента или группу.' });
      return;
    }
    try {
      // Здесь можно реализовать вызов API для назначения экзамена, например:
      // await axios.post(`${baseURL}/assign-exam`, { examId: selectedExam, studentIds: selectedStudents }, { headers... })
      // Для демонстрации просто формируем сообщение:
      setAssignmentMessage({
        type: 'success',
        text: `Экзамен успешно назначен! (Exam ID: ${selectedExam})\nСтуденты: ${selectedStudents.join(', ')}`
      });
      // Сброс выбранных студентов и экзамена
      setSelectedStudents([]);
      setSelectedExam('');
    } catch (error) {
      setAssignmentMessage({ type: 'error', text: 'Ошибка при назначении экзамена.' });
    }
    // Скрытие сообщения через 3 секунды
    setTimeout(() => {
      setAssignmentMessage(null);
    }, 3000);
  };

  // Функция для рендеринга контента в зависимости от activeView
  const renderContent = () => {
    if (activeView === 'profile') {
      return (
        <div className="profile-section">
          <h2>Teacher Profile</h2>
          <p>
            Welcome, {teacherName}! This is your profile page where you can view your personal information and manage your exams.
          </p>
          <ul>
            <li><strong>Email:</strong> {teacherEmail}</li>
          </ul>
        </div>
      );
    }
    if (activeView === 'createExam') {
      return (
        <CreateExamForm
          onCancel={() => setActiveView('profile')}
          onExamCreated={handleExamCreated}
        />
      );
    }
    if (activeView === 'students') {
      return (
        <div className="students-section">
          <h2>Students and Groups</h2>
          {/* Блок выбора экзамена для назначения */}
          <div className="assignment-section">
            <label htmlFor="examSelect">Выберите экзамен для назначения:</label>
            <select
              id="examSelect"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value="">-- Выберите экзамен --</option>
              {availableExams.map((exam) => (
                <option key={exam.ExamID} value={exam.ExamID}>
                  {exam.Title} (Дата: {new Date(exam.Date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          {assignmentMessage && (
            <div className={`custom-alert ${assignmentMessage.type}`}>
              {assignmentMessage.text.split('\n').map((line, index) => (
                <p key={index} style={{ margin: 0 }}>{line}</p>
              ))}
            </div>
          )}
          {studentsLoading ? (
            <p>Loading students...</p>
          ) : studentsError ? (
            <p className="error">{studentsError}</p>
          ) : (
            <div className="table-container">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th onClick={toggleGroupSort} className="sortable" style={{cursor: 'pointer'}}>
                      Group {groupSortOrder === 'asc' ? '▲' : '▼'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student) => (
                    <tr key={student.StudentID}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.StudentID)}
                          onChange={() => toggleStudentSelection(student.StudentID)}
                        />
                      </td>
                      <td>{student.StudentName}</td>
                      <td>{student.Email}</td>
                      <td>{student.groupName || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="submit-btn" onClick={handleAssignExam}>
                Assign Exam to Selected Students
              </button>
            </div>
          )}
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
              <span className="user-name">{teacherName}</span>
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
                <span>Home / Profile</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('createExam')}>
                <FaBook className="menu-icon" />
                <span>Create Exam</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('students')}>
                <FaUsers className="menu-icon" />
                <span>Students/Groups</span>
              </Link>
            </li>
            <li>
              <Link to="/teacher-settings">
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
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default TeacherDashboard;
