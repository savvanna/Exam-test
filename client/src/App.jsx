import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import CreateExam from './components/Exam/CreateExam';
import Results from './components/Exam/Results';
import TakeExam from './components/Exam/TakeExam';

const App = () => {
  const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  const isTeacher = () => {
    return localStorage.getItem('role') === 'teacher';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/create-exam"
          element={
            isLoggedIn() && isTeacher() ? ( // Проверяем и роль
              <CreateExam />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/results"
          element={
            isLoggedIn() ? (
              <Results />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/take-exam"
          element={
            isLoggedIn() ? (
              <TakeExam />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;