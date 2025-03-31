// client/src/components/Dashboard/StudentDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student Name';
  const role = localStorage.getItem('role') || 'student';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-info">
          {/* Имя и иконка кликабельны – переход к профилю */}
          <Link to="/student-profile">
            <FaUser size={40} />
          </Link>
          <div className="profile-text">
            <Link to="/student-profile" className="user-link">
              <span className="user-name">{userName}</span>
            </Link>
            <span className="user-role">({role.charAt(0).toUpperCase() + role.slice(1)})</span>
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
              <Link to="/student-profile">
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
          Welcome, {userName}! This is your profile page where you can view your exam history, progress, and personal details.
        </p>
        {/* Здесь можно разместить дополнительную информацию профиля */}
      </main>
    </div>
  );
};

export default StudentDashboard;
