// client/src/components/ModuleTests/ModuleTestResult.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/CreateExam.css'; // Используем стили из createExam.css для единообразного дизайна

const ModuleTestResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const score = state?.score ?? 0;
  const total = state?.total ?? 0;
  const moduleTitle = state?.moduleTitle ?? "Модуль";

  return (
    <div className="exam-container">
      <h2>Результаты теста по модулю {moduleTitle}</h2>
      <p style={{ textAlign: 'center', fontSize: '20px', marginBottom: '30px' }}>
        Вы ответили правильно на <strong>{score}</strong> из <strong>{total}</strong> вопросов.
      </p>
      <button 
        className="submit-btn" 
        onClick={() => navigate('/student-dashboard')}
        style={{ display: 'block', margin: '0 auto', padding: '12px 25px', fontSize: '16px' }}
      >
        Вернуться в кабинет
      </button>
    </div>
  );
};

export default ModuleTestResult;
