// client/src/components/ModuleTests/ModuleTests.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ModuleTests.css';

// Импортируем изображения из папки assets
import coreImg from '../../assets/images/core.jpg';
import behaviourImg from '../../assets/images/behaviour.jpg';
import parkingImg from '../../assets/images/parking.jpg';
import emergenciesImg from '../../assets/images/emergencies.jpg';
import roadPosImg from '../../assets/images/road_position.jpg';
import intersectionImg from '../../assets/images/intersection.jpg';

const ModuleTests = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [selectedModule, setSelectedModule] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Пример списка модулей со свойством "img" (ссылка на импортированное изображение)
  const modules = [
    { id: 1, title: "Core", duration: 12, img: coreImg },
    { id: 2, title: "Behaviour", duration: 15, img: behaviourImg },
    { id: 3, title: "Parking", duration: 5, img: parkingImg },
    { id: 4, title: "Emergencies", duration: 6, img: emergenciesImg },
    { id: 5, title: "Road Position", duration: 5, img: roadPosImg },
    { id: 6, title: "Intersection", duration: 13, img: intersectionImg },
  ];

  // Набор вопросов для теста (одинаков для всех модулей в примере)
  const defaultQuestions = [
    {
      question: "Вопрос 1: Какой правильный вариант ответа?",
      answers: { A: "Вариант A", B: "Вариант B", C: "Вариант C", D: "Вариант D" },
      correct: "B"
    },
    {
      question: "Вопрос 2: Выберите правильный ответ.",
      answers: { A: "Вариант A", B: "Вариант B", C: "Вариант C", D: "Вариант D" },
      correct: "C"
    },
    {
      question: "Вопрос 3: Какой из вариантов верен?",
      answers: { A: "Вариант A", B: "Вариант B", C: "Вариант C", D: "Вариант D" },
      correct: "A"
    },
    {
      question: "Вопрос 4: Какой правильный ответ?",
      answers: { A: "Вариант A", B: "Вариант B", C: "Вариант C", D: "Вариант D" },
      correct: "D"
    },
    {
      question: "Вопрос 5: Выберите правильный ответ.",
      answers: { A: "Вариант A", B: "Вариант B", C: "Вариант C", D: "Вариант D" },
      correct: "B"
    },
  ];

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setView("intro");
  };

  const handleStartTest = () => {
    setAnswers({});
    setScore(null);
    setView("test");
  };

  const handleAnswerChange = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();
    let correctCount = 0;
    defaultQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setView("result");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedModule(null);
    setAnswers({});
    setScore(null);
  };

  const renderContent = () => {
    switch(view) {
      case "list":
        return (
          <div className="modules-list-container">
            <h2>Модуль-тесты</h2>
            <div className="modules-list">
              {modules.map(mod => (
                <div key={mod.id} className="module-card">
                  <img src={mod.img} alt={`${mod.title} Module`} className="module-img" />
                  <h3>{mod.title}</h3>
                  <p>Длительность: {mod.duration} минут</p>
                  <button className="submit-btn" onClick={() => handleSelectModule(mod)}>
                    Начать тест
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "intro":
        return (
          <div className="module-intro">
            <h2>{selectedModule.title} – Модуль-тест</h2>
            <p>
              Вы выбрали модуль "{selectedModule.title}". В этом тесте вам предстоит ответить на 5 вопросов.
              Внимательно прочитайте вопрос и выберите один из предложенных вариантов.
            </p>
            <button className="submit-btn" onClick={handleStartTest}>Начать тест</button>
            <button className="cancel-btn" onClick={handleBackToList}>Назад к списку</button>
          </div>
        );
      case "test":
        return (
          <div className="module-test">
            <h2>Тест: {selectedModule.title}</h2>
            <form onSubmit={handleSubmitTest}>
              {defaultQuestions.map((q, index) => (
                <div key={index} className="question-block">
                  <p><strong>{q.question}</strong></p>
                  {Object.entries(q.answers).map(([key, answerText]) => (
                    <div key={key} className="answer-option">
                      <label>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={key}
                          checked={answers[index] === key}
                          onChange={() => handleAnswerChange(index, key)}
                        />
                        {key}. {answerText}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
              <button type="submit" className="submit-btn">Отправить тест</button>
            </form>
            <button className="cancel-btn" onClick={handleBackToList}>Отмена</button>
          </div>
        );
      case "result":
        return (
          <div className="module-result">
            <h2>Результаты теста: {selectedModule.title}</h2>
            <p>Вы ответили правильно на {score} из {defaultQuestions.length} вопросов.</p>
            <button className="submit-btn" onClick={handleBackToList}>Вернуться к списку модулей</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modules-container" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Модуль-тесты</h1>
        <button className="cancel-btn" onClick={() => navigate(-1)}>Вернуться в кабинет</button>
      </header>
      {renderContent()}
    </div>
  );
};

export default ModuleTests;
