// client/src/components/ModuleTests/CoreModule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Импорт изображений для вопросов из каталога модуля Core
import sign1 from '../../assets/modules/core/sign1.jpg';
import sign2 from '../../assets/modules/core/sign2.jpg';
import sign3 from '../../assets/modules/core/sign3.jpg';
import sign4 from '../../assets/modules/core/sign4.jpg';

import '../../styles/ModuleTests.css';

const CoreModule = () => {
  const navigate = useNavigate();

  const questions = [
    {
      question: "Вопрос 1: Какой знак означает 'Уступи дорогу'?",
      answers: { A: "Знак 'Главная дорога'", B: "Знак 'Уступи дорогу'", C: "Знак 'Стоп'", D: "Знак 'Движение без остановки'" },
      correct: "B"
    },
    {
      question: "Вопрос 2: Что изображено на картинке?",
      answers: { A: "Знак 'Стоп'", B: "Знак 'Уступи дорогу'", C: "Знак 'Главная дорога'", D: "Знак 'Ограничение скорости'" },
      correct: "B",
      img: sign1
    },
    {
      question: "Вопрос 3: Что означает знак 'Стоп'?",
      answers: { A: "Ограничение скорости", B: "Движение без остановки", C: "Обязательная остановка", D: "Пешеходный переход" },
      correct: "C"
    },
    {
      question: "Вопрос 4: Какой знак предупреждает о возможном переходе пешеходов?",
      answers: { A: "Знак 'Пешеходный переход'", B: "Знак 'Осторожно, пешеходы'", C: "Знак 'Движение запрещено'", D: "Знак 'Осторожно, дети'" },
      correct: "B"
    },
    {
      question: "Вопрос 5: Что изображено на картинке?",
      answers: { A: "Знак 'Конец населенного пункта'", B: "Знак 'Начало населенного пункта'", C: "Знак 'Пешеходный переход'", D: "Знак 'Ограничение скорости'" },
      correct: "B",
      img: sign2
    },
    {
      question: "Вопрос 6: Какой знак определяет приоритет движения на перекрестке?",
      answers: { A: "Знак 'Главная дорога'", B: "Знак 'Уступи дорогу'", C: "Знак 'Движение без остановки'", D: "Знак 'Осторожно, перекресток'" },
      correct: "A"
    },
    {
      question: "Вопрос 7: Что предусматривает правило 'Круговое движение'?",
      answers: { A: "Обязательная остановка на круге", B: "Движение по кругу без остановки", C: "Придание преимущества пересекающимся потокам", D: "Уступку транспортных средств на круге" },
      correct: "D"
    },
    {
      question: "Вопрос 8: Что изображено на картинке?",
      answers: { A: "Знак 'Железнодорожный переезд с шлагбаумом'", B: "Знак 'Внимание, переезд'", C: "Знак 'Пешеходный переход'", D: "Знак 'Опасный поворот'" },
      correct: "A",
      img: sign3
    },
    {
      question: "Вопрос 9: Какой знак указывает на обязательное выполнение манёвра (например, разворот)?",
      answers: { A: "Знак 'Обязательное направление'", B: "Знак 'Движение без остановки'", C: "Знак 'Стоп'", D: "Знак 'Уступи дорогу'" },
      correct: "A"
    },
    {
      question: "Вопрос 10: Что изображено на картинке?",
      answers: { A: "Знак 'Ограничение скорости'", B: "Знак 'Обгон запрещен'", C: "Знак 'Движение без остановки'", D: "Знак 'Безопасная дистанция'" },
      correct: "B",
      img: sign4
    }
  ];

  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (index, option) => {
    setAnswers(prev => ({ ...prev, [index]: option }));
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) correctCount++;
    });
    navigate('/module-tests/result', { state: { score: correctCount, total: questions.length, moduleTitle: "Core" } });
  };

  return (
    <div className="exam-container">
      <h2>Тест по модулю Общие Правила</h2>
      <form onSubmit={handleSubmitTest} className="exam-form">
        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <p><strong>{q.question}</strong></p>
            {q.img && (
              <div className="question-image">
                <img 
                  src={q.img} 
                  alt={`Иллюстрация для вопроса ${index + 1}`} 
                  style={{ maxWidth: '300px', display: 'block', margin: '10px auto' }}
                />
              </div>
            )}
            {Object.entries(q.answers).map(([letter, answerText]) => (
              <div key={letter} className="answer-option">
                <label className="option-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={letter}
                    checked={answers[index] === letter}
                    onChange={() => handleAnswerChange(index, letter)}
                    className="option-radio"
                  />
                  <span className="option-text">{letter}. {answerText}</span>
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="submit-btn">Завершить тест</button>
      </form>
    </div>
  );
};

export default CoreModule;
