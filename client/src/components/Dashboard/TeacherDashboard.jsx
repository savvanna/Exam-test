// client/src/components/Dashboard/TeacherDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaBook, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  // Читаем данные учителя из localStorage (они должны быть заранее установлены)
  const teacherName = localStorage.getItem('teacherName') || localStorage.getItem('userName') || 'Teacher Name';
  const teacherEmail = localStorage.getItem('teacherEmail') || 'teacher@example.com';
  const subject = localStorage.getItem('subject') || 'Subject';
  const role = localStorage.getItem('role') || 'teacher';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherEmail');
    localStorage.removeItem('subject');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-info">
          <Link to="/teacher-dashboard">
            <FaUser size={40} />
          </Link>
          <div className="profile-text">
            <Link to="/teacher-dashboard" className="user-link">
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
              <Link to="/teacher-dashboard">
                <FaHome className="menu-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/teacher-dashboard">
                <FaUser className="menu-icon" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/create-exam">
                <FaBook className="menu-icon" />
                <span>Create Exam</span>
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
      <main className="dashboard-content">
        <h2>Teacher Profile</h2>
        <p>
          Welcome, {teacherName}! This is your profile page where you can view your personal information and the list of exams you have created.
        </p>
        <ul>
          <li><strong>Email:</strong> {teacherEmail}</li>
          <li><strong>Subject:</strong> {subject}</li>
        </ul>
        {/* Здесь можно добавить дополнительные секции, например, статистику, историю экзаменов и т.д. */}
      </main>
    </div>
  );
};

export default TeacherDashboard;
