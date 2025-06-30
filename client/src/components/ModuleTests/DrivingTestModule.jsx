// client/src/components/ModuleTests/DrivingTestModule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Импорт изображений для вопросов с картинками
import driving1 from '../../assets/modules/driving/driving1.JPG'; 
import driving2 from '../../assets/modules/driving/driving2.JPG'; 
import driving3 from '../../assets/modules/driving/driving3.JPG'; 
import driving4 from '../../assets/modules/driving/driving4.JPG'; 
import driving5 from '../../assets/modules/driving/driving5.JPG'; 
import driving6 from '../../assets/modules/driving/driving6.JPG'; 

import '../../styles/ModuleTests.css';

const DrivingTestModule = () => {
  const navigate = useNavigate();


  const questions = [
    {
      question: "Вопрос 1: В показанной ситуации, приближаясь по дороге с гравийным покрытием к необозначенному перекрестку с грунтовой дорогой, Вы",
      answers: {
        A: " Находитесь на главной дороге.",
        B: " Находитесь на второстепенной дороге.",
        C: " Подъезжаете к перекрестку равнозначных дорог",
      },
      correct: "A",
      img: driving1
    },
    {
      question: "Вопрос 2: Как следует поступать при приближении к нерегулируемому перекрёстку?",
      answers: {
        A: "Ускориться и проехать",
        B: "Замедлить скорость и уступить дорогу",
        C: "Ехать с постоянной скоростью",
        D: "Сигналить другим водителям для проезда"
      },
      correct: "B"
    },
    {
      question: "Вопрос 3: Разрешается ли Вам при управлении автомобилем, приводимым в движение двигателем внутреннего сгорания, остановиться справа за дорожным знаком для посадки пассажира?",
      answers: {
        A: " Разрешается.",
        B: " Разрешается, только если не будет создано препятствие для зарядки электромобилей.",
        C: " Запрещается.",
      },
      correct: "C",
      img: driving2
    },
    {
      question: "Вопрос 4: Какой интервал дистанции между автомобилями рекомендуется в городских условиях?",
      answers: {
        A: "1 секунда",
        B: "2 секунды",
        C: "3 секунды",
        D: "4 секунды"
      },
      correct: "B"
    },
    {
      question: "Вопрос 5: Разметка, нанесенная на полосе движения (в виде стрелки), в показанной ситуации:",
      answers: {
        A: " Предоставляет преимущество водителю при перестроении на правую полосу.",
        B: " Предупреждает водителя о приближении к участку дороги, на котором заканчивается данная полоса проезжей части (с необходимостью перестроиться на соседнюю полосу справа).",
        C: " Предупреждает водителя о приближении к опасному повороту дороги.",
      },
      correct: "B",
      img: driving3
    },
    {
      question: "Вопрос 6: В показанной ситуации водителю красного автомобиля:",
      answers: {
        A: " Разрешено двигаться только прямо.",
        B: " Разрешено двигаться прямо, налево или на разворот.",
        C: " Разрешено двигаться налево или на разворот.",
        D: " Необходимо остановиться."
      },
      correct: "B",
      img: driving4
    },
    {
      question: "Вопрос 7: Что означает знак 'Уступи дорогу'?",
      answers: {
        A: "Обязательная остановка",
        B: "Уступить право проезда транспортным средствам",
        C: "Разрешен обгон",
        D: "Движение без ограничений"
      },
      correct: "B"
    },
    {
      question: "Вопрос 8: В каких направлениях из перечисленных Вам разрешено продолжить движение на показанном перекрестке?",
      answers: {
        A: " Только налево.",
        B: " Налево или на разворот.",
        C: " Направо, налево или на разворот.",
      },
      correct: "C",
      img: driving5
    },
    {
      question: "Вопрос 9: При движении прямо при разрешающем сигнале светофора в показанной ситуации Вы:",
      answers: {
        A: " Должны остановиться перед линией горизонтальной дорожной разметки 1.12 'стоп-линия.'",
        B: " Можете продолжить движение через перекресток без остановки.",
        C: " Обязаны уступить дорогу транспортным средствам, движущимся с других направлений.",
      },
      correct: "B",
      img: driving6
    },
    {
      question: "Вопрос 10: Как правильно действовать при аварийной ситуации на дороге?",
      answers: {
        A: "Немедленно остановиться и включить аварийные огни",
        B: "Ускорить для быстрого ухода с места аварии",
        C: "Игнорировать ситуацию и продолжать движение",
        D: "Сигналить другим участникам движения и продолжать путь"
      },
      correct: "A"
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
    navigate('/module-tests/result', {
      state: { score: correctCount, total: questions.length, moduleTitle: "Тест по вождению" }
    });
  };

  return (
    <div className="exam-container">
      <h2>Модуль "Дорога"</h2>
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

export default DrivingTestModule;
