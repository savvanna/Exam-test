// client/src/components/Exam/CreateExam.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/CreateExam.css'; // Импорт стилей для CreateExam

const CreateExam = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date) {
      setError('Title and date are required.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${baseURL}/exams`,
        { Title: title, Date: date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Exam created:', response.data);
      setSuccessMessage('Exam created successfully!');
      setTitle('');
      setDate('');
      setError('');
    } catch (error) {
      console.error('Error creating exam:', error);
      setError('Error creating exam: ' + error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create Exam</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label className="label">Title:</label>
          <input
            type="text"
            value={title}
            placeholder="Enter exam title"
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </div>
        <div className="formGroup">
          <label className="label">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="button">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
