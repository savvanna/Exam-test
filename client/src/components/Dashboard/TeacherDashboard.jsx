// client/src/components/Dashboard/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaBook,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaClipboardList
} from 'react-icons/fa';
import axios from 'axios';
import CreateExamForm from '../Exam/CreateExam';
import '../../styles/Dashboard.css';
import '../../styles/CreateExam.css';
import ExamResults from '../Exam/ExamResults';

const TeacherDashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  // activeView: "profile", "createExam", "students", "results", "modules"
  const [activeView, setActiveView] = useState('profile');

  // Состояния для списка студентов
  const [studentsData, setStudentsData] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');
  // Список выбранных студентов (их ID)
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Состояния для экзамена, который назначается
  const [availableExams, setAvailableExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  // Сообщение при назначении экзамена
  const [assignmentMessage, setAssignmentMessage] = useState(null);

  // Состояния для результатов экзаменов (для преподавателя)
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState('');

  // Состояние сортировки по колонке "Group"
  const [groupSortOrder, setGroupSortOrder] = useState('asc');

  // Извлекаем данные преподавателя из localStorage
  const teacherName = localStorage.getItem('teacherName') || 'Teacher Name';
  const teacherEmail = localStorage.getItem('teacherEmail') || 'teacher@example.com';
  const role = localStorage.getItem('role') || 'teacher';
  const teacherID = localStorage.getItem('teacherID') || null;

  // Функция форматирования даты (формат "dd.mm.yyyy")
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? 'N/A'
      : d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Функция логаута
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherEmail');
    localStorage.removeItem('subject');
    localStorage.removeItem('teacherID');
    setAuth({ token: null, role: null });
    navigate('/');
  };

  // Callback после создания экзамена
  const handleExamCreated = (exam) => {
    console.log('Exam created:', exam);
    setActiveView('profile');
  };

  // Загрузка студентов и экзаменов при view "students"
  useEffect(() => {
    if (activeView === 'students') {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

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

  // Загрузка результатов экзаменов при view "results"
  useEffect(() => {
    if (activeView === 'results' && teacherID) {
      const fetchResults = async () => {
        setResultsLoading(true);
        try {
          const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');
          // GET-запрос: /results?teacherId=<teacherID>
          const response = await axios.get(`${baseURL}/results?teacherId=${teacherID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setResults(response.data);
          setResultsError('');
        } catch (error) {
          console.error('Ошибка загрузки результатов:', error);
          setResultsError('Ошибка загрузки результатов экзаменов.');
        } finally {
          setResultsLoading(false);
        }
      };
      fetchResults();
    }
  }, [activeView, teacherID]);

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
    setGroupSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
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
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseURL}/exams/assign`,
        {
          examId: selectedExam,
          studentIds: selectedStudents,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignmentMessage({
        type: 'success',
        text: `Экзамен успешно назначен! (Exam ID: ${selectedExam})\nСтуденты: ${selectedStudents.join(', ')}`,
      });
      setSelectedStudents([]);
      setSelectedExam('');
    } catch (error) {
      setAssignmentMessage({ type: 'error', text: 'Ошибка при назначении экзамена.' });
    }
    setTimeout(() => {
      setAssignmentMessage(null);
    }, 3000);
  };

  // Рендеринг содержимого в зависимости от activeView
  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <div className="profile-section">
            <h2>Профиль учителя</h2>
            <p>Добро пожаловать, {teacherName}!</p>
            <ul>
              <li><strong>Email:</strong> {teacherEmail}</li>
            </ul>
          </div>
        );
      case 'createExam':
        return (
          <CreateExamForm onCancel={() => setActiveView('profile')} onExamCreated={handleExamCreated} />
        );
      case 'students':
        return (
          <div className="students-section">
            <h2>Студенты/Группы</h2>
            <div className="assignment-section">
              <label htmlFor="examSelect">Выберите экзамен для назначения:</label>
              <select id="examSelect" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
                <option value="">-- Выберите экзамен --</option>
                {availableExams.map((exam) => (
                  <option key={exam.ExamID} value={exam.ExamID}>
                    {exam.Title} (Дата: {formatDate(exam.Date)})
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
                      <th onClick={toggleGroupSort} className="sortable" style={{ cursor: 'pointer' }}>
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
                  Назначить экзамен выбранным студентам
                </button>
              </div>
            )}
          </div>
        );
      case 'results':
  return (
    <div className="results-section">
      <ExamResults results={results} role={role} />
      <button className="back-to-profile-btn" onClick={() => setActiveView('profile')}>
        Вернуться к профилю
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
            <FaUser size={40} color="#007bff" />
          </Link>
          <div className="profile-text">
            <Link to="#" onClick={() => setActiveView('profile')} className="user-link">
              <span className="user-name">{teacherName}</span>
            </Link>
            <span className="user-role">({role.charAt(0).toUpperCase() + role.slice(1)})</span>
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
              <Link to="#" onClick={() => setActiveView('createExam')}>
                <FaBook className="menu-icon" />
                <span>Создать экзамен</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('students')}>
                <FaUsers className="menu-icon" />
                <span>Студенты/Группы</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setActiveView('results')}>
                <FaClipboardList className="menu-icon" />
                <span>Результаты экзаменов</span>
              </Link>
            </li>
            <li>
              <Link to="/teacher-settings">
                <FaCog className="menu-icon" />
                <span>Настройки</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" color="#fff" />
          <span>Выйти</span>
        </div>
      </aside>
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default TeacherDashboard;
