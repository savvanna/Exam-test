
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import behaviour1 from '../../assets/modules/behaviour/behaviour1.jpg'; // для вопроса B2
import behaviour2 from '../../assets/modules/behaviour/behaviour2.jpg'; 
import behaviour3 from '../../assets/modules/behaviour/behaviour3.jpg'; 

import '../../styles/ModuleTests.css';

const BehaviourModule = () => {
  const navigate = useNavigate();

  const questions = [
    {
      
      question: "Вопрос 1: Если вы едете ночью с включенным дальним светом фар, когда ДОЛЖНЫ переключать их на ближний?",
      answers: {
        A: "При приближении встречного транспорта на расстоянии 200 метров",
        B: "Только после того, как встречный транспорт проедет",
        C: "За 5 секунд до встречи с другим транспортным средством",
        D: "Никогда, дальний свет можно держать всегда включенным"
      },
      correct: "A"
    },
    {
      
      question: "Что изображено на картинке?",
      answers: {
        A: "Суббота, воскресенье и праздничные дни",
        B: "Рабочие дни",
        C: "Понедельник – пятница",
        D: "Все 7 дней"
      },
      correct: "A",
      img: behaviour1
    },
    {
      // B3 – без изображения
      question: "Вопрос 3: Что следует делать, если вам приходится ехать на низкой скорости, что может задерживать другие транспортные средства?",
      answers: {
        A: "Сигнализировать о замедлении",
        B: "Перестроиться в другую полосу или остановиться, если это безопасно",
        C: "Ускориться до максимально возможной скорости",
        D: "Игнорировать ситуацию"
      },
      correct: "B"
    },
    {
      // B4 – без изображения
      question: "Вопрос 4: Что НЕЛЬЗЯ делать при движении по автомагистрали?",
      answers: {
        A: "Сменить полосу без использования зеркал",
        B: "Использовать мобильный телефон без hands‑free",
        C: "Перестраиваться на встречную полосу",
        D: "Оставаться в своей полосе"
      },
      correct: "C"
    },
    {
      // B5 – с изображением, изменён текст вопроса
      question: "Что изображено на картинке?",
      answers: {
        A: "Суббота, воскресенье",
        B: "Рабочие дни",
        C: "Понедельник – пятница",
        D: "Праздничные дни"
      },
      correct: "B",
      img: behaviour2
    },
    {
      // B6 – без изображения
      question: "Вопрос 6: Какую рекомендуемую дистанцию следует соблюдать при проезде мимо велосипедиста?",
      answers: {
        A: "1 метр",
        B: "2 метра",
        C: "3 метра",
        D: "5 метров"
      },
      correct: "B"
    },
    {
      // B7 – с изображением, изменён текст вопроса
      question: "Что изображено на картинке?",
      answers: {
        A: "Светлое время суток",
        B: "Суббота и воскресенье",
        C: "Все 7 дней",
        D: "Нет корректного варианта"
      },
      correct: "A",
      img: behaviour3
    },
    {
      // B8 – без изображения
      question: "Вопрос 8: Что следует делать при движении в дождливую погоду?",
      answers: {
        A: "Увеличить дистанцию и снизить скорость",
        B: "Использовать дальний свет для лучшей видимости",
        C: "Держать обычную скорость и не менять дистанцию",
        D: "Перестроиться на встречную полосу"
      },
      correct: "A"
    },
    {
      // B9 – без изображения
      question: "Вопрос 9: Какую стратегию следует применять при движении к нерегулируемому перекрестку?",
      answers: {
        A: "Проезжать без остановки",
        B: "Уступать дорогу транспортным средствам, приближающимся слева",
        C: "Замедлять скорость и быть готовым уступить дорогу",
        D: "Проезжать на высокой скорости"
      },
      correct: "C"
    },
    {
      // B10 – без изображения
      question: "Вопрос 10: Как поступить, если на дороге неожиданно появляется пешеход?",
      answers: {
        A: "Резко затормозить",
        B: "Продолжать движение",
        C: "Снизить скорость и предоставить преимущество пешеходу",
        D: "Ускориться, чтобы обогнать пешехода"
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
    // Переходим на общую страницу результата, передавая результат теста и название модуля.
    navigate('/module-tests/result', { state: { score: correctCount, total: questions.length, moduleTitle: "Behaviour" } });
  };

  return (
    <div className="exam-container">
      <h2>Тест по модулю Behaviour</h2>
      <form onSubmit={handleSubmitTest} className="exam-form">
        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <p><strong>{q.question}</strong></p>
            {/* Если для вопроса задана иллюстрация, отображаем её */}
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

export default BehaviourModule;
