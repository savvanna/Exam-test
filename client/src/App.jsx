// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import CreateExam from './components/Exam/CreateExam';
import TakeExam from './components/Exam/TakeExam';
import Results from './components/Exam/Results';
import ModuleTests from './components/ModuleTests/ModuleTests';
import CoreModule from './components/ModuleTests/CoreModule';
import BehaviourModule from './components/ModuleTests/BehaviourModule';
import ParkingModule from './components/ModuleTests/ParkingModule';
import EmergenciesModule from './components/ModuleTests/EmergenciesModule';
import RoadRulesModule from './components/ModuleTests/RoadRulesModule';
import IntersectionModule from './components/ModuleTests/IntersectionModule';
import ModuleTestResult from './components/ModuleTests/ModuleTestResult';
import './styles/App.css';

const App = () => {
  // Инициализируем состояние аутентификации из localStorage
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  });

  // Функция для обновления состояния аутентификации и синхронизации с localStorage
  const updateAuth = (newAuth) => {
    if (newAuth.token) {
      localStorage.setItem('token', newAuth.token);
      localStorage.setItem('role', newAuth.role);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    setAuth(newAuth);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            auth.token 
              ? <Navigate to={auth.role === 'teacher' ? "/teacher-dashboard" : "/student-dashboard"} replace /> 
              : <MainPage setAuth={updateAuth} />
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            auth.token && auth.role === 'teacher'
              ? <TeacherDashboard setAuth={updateAuth} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/student-dashboard"
          element={
            auth.token && auth.role === 'student'
              ? <StudentDashboard setAuth={updateAuth} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/create-exam"
          element={
            auth.token && auth.role === 'teacher'
              ? <CreateExam />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/take-exam"
          element={
            auth.token && auth.role === 'student'
              ? <TakeExam />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/results"
          element={auth.token ? <Results /> : <Navigate to="/" replace />}
        />
        <Route
          path="/module-tests"
          element={
            auth.token && auth.role === 'student'
              ? <ModuleTests />
              : <Navigate to="/" replace />
          }
        />
        {/* Добавляем маршруты для отдельных модулей */}
        <Route path="/module-tests/core" element={<CoreModule />} />
        <Route path="/module-tests/behaviour" element={<BehaviourModule />} />
        <Route path="/module-tests/result" element={<ModuleTestResult />} />
        <Route path="/module-tests/parking" element={<ParkingModule />} />
        <Route path="/module-tests/emergencies" element={<EmergenciesModule />} />
        <Route path="/module-tests/roadrules" element={<RoadRulesModule />} />
        <Route path="/module-tests/intersection" element={<IntersectionModule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
