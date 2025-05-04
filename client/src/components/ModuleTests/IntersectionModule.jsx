// client/src/components/ModuleTests/IntersectionModule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Импорт изображений для вопросов с картинками из каталога модуля Перекрёстки
import intersection1 from '../../assets/modules/intersection/intersection1.jpg';
import intersection2 from '../../assets/modules/intersection/intersection2.jpg';
import intersection3 from '../../assets/modules/intersection/intersection3.jpg';

import '../../styles/ModuleTests.css';

const IntersectionModule = () => {
  const navigate = useNavigate();

  // Массив из 10 вопросов по теме "Перекрёстки"
  // Вопросы с индексами 2, 5 и 7 имеют изображения и текст "Что изображено на картинке?"
  const questions = [
    {
      question: "Вопрос 1: Какой маневр считается наиболее безопасным при въезде на нерегулируемый перекрёсток?",
      answers: {
        A: "Замедлить движение и уступить дорогу",
        B: "Въехать на перекрёсток с максимальной скоростью",
        C: "Проехать, не обращая внимания на приближающиеся транспортные средства",
        D: "Остановиться и дождаться полного отсутствия движения"
      },
      correct: "A"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Движение запрещено",
        B: "Главная дорога",
        C: "Ограничение скорости",
        D: "Уступите дорогу"
      },
      correct: "A",
      img: intersection1
    },
    {
      question: "Вопрос 3: На регулируемом перекрёстке какой сигнал светофора разрешает проезд?",
      answers: {
        A: "Зелёный",
        B: "Жёлтый",
        C: "Красный",
        D: "Мигание красного"
      },
      correct: "A"
    },
    {
      question: "Вопрос 4: Что означает мигание красного светофора на перекрёстке?",
      answers: {
        A: "Полный запрет проезда",
        B: "Осторожное движение с уступанием дороги",
        C: "Смена фаз без остановки",
        D: "Аварийное состояние электросети"
      },
      correct: "B"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Круговое движение",
        B: "Главная дорога",
        C: "Перекрёсток с разворотом",
        D: "Уступите дорогу"
      },
      correct: "A",
      img: intersection2
    },
    {
      question: "Вопрос 6: Что нужно делать, если два автомобиля подъезжают к перекрёстку одновременно?",
      answers: {
        A: "Тот, кто подъезжает справа, имеет преимущество",
        B: "Оба должны ускориться для быстрого проезда",
        C: "Оба должны уступить право проезда независимо от стороны",
        D: "Приоритет определяется знаком приоритета"
      },
      correct: "A"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Пересечение равнозначных дорог",
        B: "Нерегулируемый перекрёсток с круговым движением",
        C: "Перекрёсток с разметкой, обозначающей главную дорогу",
        D: "Перекрёсток с пешеходным переходом"
      },
      correct: "A",
      img: intersection3
    },
    {
      question: "Вопрос 8: Какие действия должен предпринять водитель, если на перекрёстке отсутствует регулирование?",
      answers: {
        A: "Придерживаться правила «уступи дорогу»",
        B: "Проехать без остановки",
        C: "Ускориться для быстрого проезда",
        D: "Остановиться даже при отсутствии движения"
      },
      correct: "A"
    },
    {
      question: "Вопрос 9: Что означает наличие знака «Главная дорога» на перекрёстке?",
      answers: {
        A: "Водитель имеет приоритет перед транспортом, подъезжающим с других направлений",
        B: "Необходимо снизить скорость",
        C: "Обгон запрещён",
        D: "Обязательно использовать аварийную сигнализацию"
      },
      correct: "A"
    },
    {
      question: "Вопрос 10: Какая мера безопасности особенно важна при проезде перекрёстка?",
      answers: {
        A: "Обязательное использование ремней безопасности",
        B: "Постоянная проверка зеркал",
        C: "Соблюдение достаточной дистанции от впереди идущего автомобиля",
        D: "Ускорение для минимизации времени проезда"
      },
      correct: "C"
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
      state: { score: correctCount, total: questions.length, moduleTitle: "Intersection" }
    });
  };

  return (
    <div className="exam-container">
      <h2>Тест по модулю Перекрёстки</h2>
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

export default IntersectionModule;
