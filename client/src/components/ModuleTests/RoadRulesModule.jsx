// client/src/components/ModuleTests/RoadRulesModule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Импорт изображений для вопросов с картинками из каталога модуля "Правила на дороге"
import roadrules1 from '../../assets/modules/roadrules/roadrules1.jpg';
import roadrules2 from '../../assets/modules/roadrules/roadrules2.jpg';
import roadrules3 from '../../assets/modules/roadrules/roadrules3.jpg';

import '../../styles/ModuleTests.css';

const RoadRulesModule = () => {
  const navigate = useNavigate();

  // Массив из 10 вопросов
  // Вопросы 2, 5 и 7 имеют картинки и текст "Что изображено на картинке?"
  const questions = [
    {
      // Q1 – без картинки: вопрос про приоритет на нерегулируемом перекрестке
      question: "Вопрос 1: На нерегулируемом перекрестке, кто имеет преимущество?",
      answers: {
        A: "Тот, кто подъезжает справа",
        B: "Тот, кто подъезжает слева",
        C: "Первым достигнувший перекрестка",
        D: "Всегда уступают транспортные средства, движущиеся по главной дороге"
      },
      correct: "A"
    },
    {
      // Q2 – с картинкой: изображение знака главной дороги (например)
      question: "Что изображено на картинке?",
      answers: {
        A: "Главная дорога",
        B: "Уступите дорогу",
        C: "Ограничение скорости",
        D: "Движение запрещено"
      },
      correct: "A",
      img: roadrules1
    },
    {
      // Q3 – без картинки: вопрос про поведение на нерегулируемом перекрестке
      question: "Вопрос 3: Как следует поступать на нерегулируемом перекрестке?",
      answers: {
        A: "Проезжать быстро, не оглядываясь",
        B: "Остановиться и уступить дорогу транспортным средствам, приближающимся справа",
        C: "Ехать с максимальной скоростью, чтобы первым пересечь перекресток",
        D: "Проходить только через разметку"
      },
      correct: "B"
    },
    {
      // Q4 – без картинки: вопрос о требуемой дистанции
      question: "Вопрос 4: Какую дистанцию рекомендуется соблюдать между транспортными средствами?",
      answers: {
        A: "Минимум 1 секунду",
        B: "Минимум 2 секунды",
        C: "Минимум 3 секунды",
        D: "Минимум 5 секунд"
      },
      correct: "B"
    },
    {
      // Q5 – с картинкой: изображение знака ограничения скорости
      question: "Что изображено на картинке?",
      answers: {
        A: "Ограничение скорости",
        B: "Движение запрещено",
        C: "Уступите дорогу",
        D: "Главная дорога"
      },
      correct: "A",
      img: roadrules2
    },
    {
      // Q6 – без картинки: вопрос о пешеходном переходе
      question: "Вопрос 6: Какие меры необходимо принимать при приближении к пешеходному переходу?",
      answers: {
        A: "Ускориться и проехать как можно быстрее",
        B: "Снизить скорость или остановиться, чтобы пешеходы могли перейти дорогу",
        C: "Игнорировать пешеходный переход, если нет пешеходов",
        D: "Мигать фарами и продолжать движение"
      },
      correct: "B"
    },
    {
      // Q7 – с картинкой: изображение раздела полос движения (например)
      question: "Что изображено на картинке?",
      answers: {
        A: "Поворот запрещён",
        B: "Раздел полос движения",
        C: "Обгон запрещён",
        D: "Движение только в одну сторону"
      },
      correct: "A",
      img: roadrules3
    },
    {
      // Q8 – без картинки: вопрос про опасный маневр
      question: "Вопрос 8: Какой маневр является наименее безопасным на дороге?",
      answers: {
        A: "Плавное торможение",
        B: "Резкое торможение",
        C: "Плавное перестроение",
        D: "Предусмотрительное ускорение"
      },
      correct: "B"
    },
    {
      // Q9 – без картинки: вопрос о приближении к пешеходному переходу
      question: "Вопрос 9: Что необходимо делать при приближении к пешеходному переходу?",
      answers: {
        A: "Ускориться для быстрого проезда",
        B: "Снизить скорость и предоставить пешеходам преимущество",
        C: "Не обращать внимания на пешеходов",
        D: "Переключиться на вторую полосу"
      },
      correct: "B"
    },
    {
      // Q10 – без картинки: вопрос о светофоре на перекрестке
      question: "Вопрос 10: Как следует вести себя при красном светофоре?",
      answers: {
        A: "Проехать перекресток, если нет пешеходов",
        B: "Остановиться и ждать зеленого сигнала",
        C: "Ускориться, чтобы проехать до смены сигнала",
        D: "Сигналить и обогнать стоящую машину"
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
    navigate('/module-tests/result', { state: { score: correctCount, total: questions.length, moduleTitle: "Road Rules" } });
  };

  return (
    <div className="exam-container">
      <h2>Тест по модулю Правила на дороге</h2>
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

export default RoadRulesModule;
