// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import CreateExam from './components/Exam/CreateExam';
import TakeExam from './components/Exam/TakeExam';
import Results from './components/Exam/Results';
import './styles/App.css';

const App = () => {
  const isLoggedIn = () => localStorage.getItem('token') !== null;
  const getRole = () => localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/teacher-dashboard"
          element={isLoggedIn() && getRole() === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/student-dashboard"
          element={isLoggedIn() && getRole() === 'student' ? <StudentDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/create-exam"
          element={isLoggedIn() && getRole() === 'teacher' ? <CreateExam /> : <Navigate to="/" />}
        />
        <Route
          path="/take-exam"
          element={isLoggedIn() && getRole() === 'student' ? <TakeExam /> : <Navigate to="/" />}
        />
        <Route
          path="/results"
          element={isLoggedIn() ? <Results /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
