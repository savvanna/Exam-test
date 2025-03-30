// CreateExam.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/CreateExam.css';


const CreateExam = () => {
  // Состояния для экзамена
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  // Массив вопросов
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Функция для динамического добавления нового вопроса (максимум 10)
  const addQuestion = () => {
    if (questions.length >= 10) {
      setError('Максимальное количество вопросов — 10');
      return;
    }
    const newQuestion = {
      questionText: '',
      questionType: 'multiple-choice', // значение по умолчанию
      answers: [], // варианты ответов (в виде массива строк)
      correctAnswerIndex: null // индекс правильного ответа в answers
    };
    setQuestions([...questions, newQuestion]);
  };

  // Функция обновления вопроса по индексу
  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  // Удаление вопроса
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
  };

  // Добавление варианта ответа для вопроса (максимум 10 вариантов)
  const addAnswerOption = (qIndex) => {
    const question = questions[qIndex];
    if (question.answers.length >= 10) {
      setError('Максимальное количество вариантов ответов — 10');
      return;
    }
    const updatedAnswers = [...question.answers, ''];
    updateQuestion(qIndex, { ...question, answers: updatedAnswers });
  };

  // Обновление текста конкретного варианта ответа
  const updateAnswerOption = (qIndex, aIndex, text) => {
    const question = questions[qIndex];
    const updatedAnswers = question.answers.map((ans, idx) =>
      idx === aIndex ? text : ans
    );
    updateQuestion(qIndex, { ...question, answers: updatedAnswers });
  };

  // Установка правильного варианта ответа для вопроса
  const setCorrectAnswer = (qIndex, aIndex) => {
    const question = questions[qIndex];
    updateQuestion(qIndex, { ...question, correctAnswerIndex: aIndex });
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Проверка заполненности основных полей экзамена
    if (!title || !date) {
      setError('Название и дата экзамена обязательны');
      return;
    }

    // Валидация каждого вопроса
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText) {
        setError(`Вопрос ${i + 1}: заполните текст вопроса`);
        return;
      }
      if (q.answers.length === 0) {
        setError(`В вопросе ${i + 1}: добавьте хотя бы один вариант ответа`);
        return;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j]) {
          setError(`В вопросе ${i + 1}, вариант ответа ${j + 1} пустой`);
          return;
        }
      }
      if (
        q.correctAnswerIndex === null ||
        q.correctAnswerIndex < 0 ||
        q.correctAnswerIndex >= q.answers.length
      ) {
        setError(`В вопросе ${i + 1}: выберите правильный ответ`);
        return;
      }
    }

    // Преобразование массива ответов в объект: ключами будут буквы от "A" до "J"
    const answerLetters = ['A','B','C','D','E','F','G','H','I','J'];
    const preparedQuestions = questions.map((q) => {
      const answersObject = {};
      q.answers.forEach((ans, idx) => {
        answersObject[answerLetters[idx]] = ans;
      });
      return {
        Text: q.questionText,
        Type: q.questionType,
        Answers: answersObject,
        CorrectAnswer: answerLetters[q.correctAnswerIndex]
      };
    });

    // Формируем объект экзамена
    const payload = {
      Title: title,
      Date: date,
      Questions: preparedQuestions
    };

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      // Отправка данных экзамена с вопросами на сервер (эндпоинт /exams/detailed)
      const response = await axios.post(`${baseURL}/exams/detailed`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Exam created:', response.data);
      setSuccessMessage('Экзамен успешно создан!');
      setTitle('');
      setDate('');
      setQuestions([]);
    } catch (err) {
      console.error('Ошибка при создании экзамена:', err);
      setError('Ошибка при создании экзамена: ' + err.message);
    }
  };

  return (
    <div className="exam-container">
      <h2>Создать экзамен</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-group">
          <label>Название экзамена:</label>
          <input
            type="text"
            value={title}
            placeholder="Введите название экзамена"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Дата экзамена:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <h3>Вопросы</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <div className="question-header">
              <h4>Вопрос {qIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="remove-btn"
              >
                Удалить вопрос
              </button>
            </div>
            <div className="form-group">
              <label>Текст вопроса:</label>
              <input
                type="text"
                value={q.questionText}
                placeholder="Введите текст вопроса"
                onChange={(e) =>
                  updateQuestion(qIndex, { ...q, questionText: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Тип вопроса:</label>
              <select
                value={q.questionType}
                onChange={(e) =>
                  updateQuestion(qIndex, { ...q, questionType: e.target.value })
                }
              >
                <option value="multiple-choice">Множественный выбор</option>
                <option value="true/false">Верно/Неверно</option>
                <option value="short-answer">Краткий ответ</option>
              </select>
            </div>
            <div className="answers-section">
              <h5>Варианты ответов</h5>
              {q.answers.map((ans, aIndex) => (
                <div key={aIndex} className="answer-option">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswerIndex === aIndex}
                    onChange={() => setCorrectAnswer(qIndex, aIndex)}
                  />
                  <input
                    type="text"
                    value={ans}
                    placeholder={`Вариант ответа ${aIndex + 1}`}
                    onChange={(e) =>
                      updateAnswerOption(qIndex, aIndex, e.target.value)
                    }
                  />
                </div>
              ))}
              {q.answers.length < 10 && (
                <button
                  type="button"
                  onClick={() => addAnswerOption(qIndex)}
                  className="add-answer-btn"
                >
                  Добавить вариант ответа
                </button>
              )}
            </div>
          </div>
        ))}
        {questions.length < 10 && (
          <button
            type="button"
            onClick={addQuestion}
            className="add-question-btn"
          >
            Добавить вопрос
          </button>
        )}
        <button type="submit" className="submit-btn">
          Сохранить экзамен
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
