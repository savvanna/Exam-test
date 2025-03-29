import React, { useState } from 'react';
import axios from 'axios';

const CreateExam = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date) {
      setError('Title and date are required.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        '/exams', // Замените на ваш URL для создания экзамена
        { Title: title, Date: date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Exam created:', response.data);
      alert('Exam created successfully!');
      setTitle(''); // Clear the form
      setDate('');
      setError('');
    } catch (error) {
      console.error('Error creating exam:', error);
      setError('Error creating exam: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Create Exam</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit">Create Exam</button>
      </form>
    </div>
  );
};

export default CreateExam;