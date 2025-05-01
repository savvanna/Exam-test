// client/src/components/ModuleTests/ParkingModule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Импорт изображений для вопросов с картинками из каталога модуля Parking
import parking1 from '../../assets/modules/parking/parking1.jpg';
import parking2 from '../../assets/modules/parking/parking2.jpg';
import parking3 from '../../assets/modules/parking/parking3.jpg';

import '../../styles/ModuleTests.css';

const ParkingModule = () => {
  const navigate = useNavigate();

  // Массив из 10 вопросов по теме парковки.
  // Вопросы с индексами 1, 4 и 7 (Q2, Q5, Q8) имеют изображения и текст: "Что изображено на картинке?"
  const questions = [
    {
      question: "Вопрос 1: Какой способ парковки наиболее эффективен в условиях ограниченного пространства?",
      answers: {
        A: "Параллельная парковка",
        B: "Вертикальная парковка",
        C: "Диагональная парковка",
        D: "Поперечная парковка"
      },
      correct: "A"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Параллельная парковка",
        B: "Вертикальная парковка",
        C: "Диагональная парковка",
        D: "Поворотная парковка"
      },
      correct: "A",
      img: parking1
    },
    {
      question: "Вопрос 3: Как правильно осуществлять обратный ход при парковке задним ходом?",
      answers: {
        A: "Смотря только в зеркало",
        B: "Смотря через плечо",
        C: "Смотря в зеркало и через плечо",
        D: "Оперируя только скоростью"
      },
      correct: "C"
    },
    {
      question: "Вопрос 4: Какие сигналы поворота обязательны при выезде с парковочного места?",
      answers: {
        A: "Сигнал поворота",
        B: "Аварийная сигнализация",
        C: "Сигнал поворота и мигалка",
        D: "Никакие сигналы"
      },
      correct: "A"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Диагональная парковка",
        B: "Вертикальная парковка",
        C: "Параллельная парковка",
        D: "Поворотная парковка"
      },
      correct: "B",
      img: parking2
    },
    {
      question: "Вопрос 6: Какое расстояние должно соблюдаться между автомобилями на парковке?",
      answers: {
        A: "Минимум 50 см",
        B: "Минимум 1 метр",
        C: "Минимум 1,5 метра",
        D: "Минимум 2 метра"
      },
      correct: "C"
    },
    {
      question: "Вопрос 7: Какой из способов парковки является наиболее сложным для водителя?",
      answers: {
        A: "Параллельная парковка",
        B: "Вертикальная парковка",
        C: "Диагональная парковка",
        D: "Автоматическая парковка"
      },
      correct: "A"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Вертикальная парковка",
        B: "Диагональная парковка",
        C: "Параллельная парковка",
        D: "Поворотная парковка"
      },
      correct: "B",
      img: parking3
    },
    {
      question: "Вопрос 9: Какая мера безопасности обязательна при парковке на уклонной дороге?",
      answers: {
        A: "Использовать стояночный тормоз",
        B: "Не предпринимать никаких мер",
        C: "Активировать аварийную сигнализацию",
        D: "Ускориться для компенсации уклона"
      },
      correct: "A"
    },
    {
      question: "Вопрос 10: Какой тип парковки лучше использовать в условиях интенсивного движения?",
      answers: {
        A: "Параллельная парковка",
        B: "Вертикальная парковка",
        C: "Диагональная парковка",
        D: "Автоматическая парковка"
      },
      correct: "B"
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
      state: { score: correctCount, total: questions.length, moduleTitle: "Parking" }
    });
  };

  return (
    <div className="exam-container">
      <h2>Тест по модулю Parking</h2>
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

export default ParkingModule;
