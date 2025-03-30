// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register'; // Импорт регистрационного компонента
import CreateExam from './components/Exam/CreateExam';
import Results from './components/Exam/Results';
import TakeExam from './components/Exam/TakeExam';
import './styles/App.css'; // Стили находятся в src/styles

const App = () => {
  const isLoggedIn = () => localStorage.getItem('token') !== null;
  const isTeacher = () => localStorage.getItem('role') === 'teacher';

  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} /> {/* Добавлен маршрут для регистрации */}
        <Route 
          path="/create-exam"
          element={isLoggedIn() && isTeacher() ? <CreateExam /> : <Navigate to="/auth/login" />}
        />
        <Route 
          path="/results" 
          element={isLoggedIn() ? <Results /> : <Navigate to="/auth/login" />}
        />
        <Route 
          path="/take-exam" 
          element={isLoggedIn() ? <TakeExam /> : <Navigate to="/auth/login" />}
        />
        <Route path="/" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
