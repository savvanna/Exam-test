// client/src/components/ModuleTests/EmergenciesModule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Импорт изображений для вопросов с картинками из каталога модуля Emergencies
import emergencies1 from '../../assets/modules/emergencies/emergencies1.jpg';
import emergencies2 from '../../assets/modules/emergencies/emergencies2.jpg';
import emergencies3 from '../../assets/modules/emergencies/emergencies3.jpg';

import '../../styles/ModuleTests.css';

const EmergenciesModule = () => {
  const navigate = useNavigate();

  const questions = [
    {
      question: "Вопрос 1: Какие меры необходимо принять при экстренном торможении?",
      answers: {
        A: "Сразу резко нажать на тормоза",
        B: "Плавно снизить скорость, максимально используя тормозную систему",
        C: "Аккуратно нажать на тормоза и постепенно снизить скорость",
        D: "Не нажимать на тормоза, чтобы сохранить управляемость"
      },
      correct: "C"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Знак аварийной остановки",
        B: "Знак аварийного торможения",
        C: "Аварийный знак с изображением треугольника и молнии",
        D: "Знак утраты давления в шинах"
      },
      correct: "A",
      img: emergencies1
    },
    {
      question: "Вопрос 3: Как следует действовать при пробуксовке на скользкой или мокрой дороге?",
      answers: {
        A: "Увеличить скорость для выезда из пробуксовки",
        B: "Слегка нажать на тормоза",
        C: "Плавно отпустить педаль газа, включить пониженную передачу и снизить скорость",
        D: "Не предпринимать никаких действий"
      },
      correct: "C"
    },
    {
      question: "Вопрос 4: Какие рекомендации по управлению автомобилем при аварийной ситуации являются верными?",
      answers: {
        A: "Резко переключить передачи для максимального ускорения",
        B: "Сохранять спокойствие, включить аварийную сигнализацию и выбрать безопасное место для остановки",
        C: "Продолжать движение, надеясь на саморазрешение ситуации",
        D: "Увеличить скорость и атаковать препятствие"
      },
      correct: "B"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Знак аварийной остановки транспорта",
        B: "Предупреждение о дорожных работах",
        C: "Инструкция по экстренной эвакуации",
        D: "Знак, предупреждающий об опасном участке дороги"
      },
      correct: "B",
      img: emergencies2
    },
    {
      question: "Вопрос 6: Что означает мигание аварийных фар на автомобиле?",
      answers: {
        A: "Сигнал участия водителя в соревновании",
        B: "Индикация того, что автомобиль находится в аварийном режиме",
        C: "Нормальная работа фар",
        D: "Сигнал о необходимости технического обслуживания"
      },
      correct: "B"
    },
    {
      question: "Что изображено на картинке?",
      answers: {
        A: "Знак, предупреждающий о возможном заносе транспортного средства",
        B: "Информационный знак о скоростном режиме",
        C: "Предупреждающий знак об опасном повороте",
        D: "Аварийный знак о потере управления"
      },
      correct: "A",
      img: emergencies3
    },
    {
      question: "Вопрос 8: Какие дополнительные меры безопасности следует предпринимать при возникновении экстренной ситуации на дороге?",
      answers: {
        A: "Включить запасные фары",
        B: "Снизить скорость, включить аварийную сигнализацию и выбрать безопасное место для остановки",
        C: "Увеличить скорость для стабилизации автомобиля",
        D: "Сделать резкий поворот для выхода из ситуации"
      },
      correct: "B"
    },
    {
      question: "Вопрос 9: Что следует делать в случае отказа тормозной системы?",
      answers: {
        A: "Использовать ручной тормоз с осторожностью, снижая скорость и выбирая безопасное место для остановки",
        B: "Переключить коробку передач на нейтральное положение",
        C: "Нажать педаль газа для ускорения",
        D: "Игнорировать проблему и продолжать движение"
      },
      correct: "A"
    },
    {
      question: "Вопрос 10: Каковы рекомендации по поведению при заносе автомобиля на скользкой дороге?",
      answers: {
        A: "Сделать резкий тормозной маневр",
        B: "Увеличить скорость для стабилизации",
        C: "Плавно снизить скорость и аккуратно вернуть автомобиль в нужное положение, избегая резких движений рулем",
        D: "Сразу переключиться на нейтральное положение"
      },
      correct: "C"
    }
  ];

  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (index, option) => {
    setAnswers(prev => ({
      ...prev,
      [index]: option,
    }));
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) correctCount++;
    });
    navigate('/module-tests/result', {
      state: {
        score: correctCount,
        total: questions.length,
        moduleTitle: "Emergencies"
      }
    });
  };

  return (
    <div className="exam-container">
      <h2>Тест по модулю Экстренные ситуации</h2>
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

export default EmergenciesModule;
