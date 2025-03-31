// client/src/components/MainPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css';
import AuthModal from './Auth/AuthModal';

const MainPage = () => {
  // Берем данные из localStorage, если пользователь авторизован
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  const [showAuthModal, setShowAuthModal] = useState(false);

  const openModal = () => setShowAuthModal(true);
  const closeModal = () => setShowAuthModal(false);

  return (
    <div className="main-container">
      <header className="navbar">
        <div className="logo">
          <Link to="/">ExamApp</Link>
        </div>
        <nav className="menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/exams">Exams</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="user-info">
          {token ? (
            // Если авторизован, имя кликабельно и ведёт на профиль (по роли)
            <Link
              to={role === 'teacher' ? '/teacher-profile' : '/student-profile'}
              className="user-link"
            >
              {userName} ({role && role.charAt(0).toUpperCase() + role.slice(1)})
            </Link>
          ) : (
            <button onClick={openModal}>Login / Register</button>
          )}
        </div>
      </header>
      <main className="content">
        <h1>Welcome to ExamApp!</h1>
        <p>
          ExamApp allows teachers to create and manage driving license exams,
          while students can take tests and view results.
        </p>
        <p>
          Use the navigation menu above to explore the details.
          (Pages marked as "Coming Soon" are placeholders.)
        </p>
      </main>
      <footer className="footer">
        <p>&copy; 2025 ExamApp. All rights reserved.</p>
      </footer>
      {showAuthModal && <AuthModal onClose={closeModal} />}
    </div>
  );
};

export default MainPage;
