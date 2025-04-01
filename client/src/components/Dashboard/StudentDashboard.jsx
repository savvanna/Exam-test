// client/src/components/Dashboard/StudentDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  // Используем правильный ключ: studentName (а не userName)
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

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-info">
          <Link to="/student-dashboard">
            <FaUser size={40} />
          </Link>
          <div className="profile-text">
            <Link to="/student-dashboard" className="user-link">
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
              <Link to="/student-dashboard">
                <FaHome className="menu-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/student-dashboard">
                <FaUser className="menu-icon" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/take-exam">
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
        <h2>Student Profile</h2>
        <p>
          Welcome, {studentName}! This is your profile page where you can view your exam history, progress, and personal details.
        </p>
        <ul>
          <li><strong>Email:</strong> {studentEmail}</li>
          <li><strong>Registration Date:</strong> {registrationDate}</li>
          <li><strong>Group:</strong> {groupName}</li>
        </ul>
      </main>
    </div>
  );
};

export default StudentDashboard;
