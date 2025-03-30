import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Register.css'; // Импортируем стили для регистрации

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    console.log('Sending request to:', `${baseURL}/auth/register`);

    try {
      const response = await axios.post(`${baseURL}/auth/register`, {
        username,
        password,
        Email: email,
        TeacherName: teacherName,
      });
      console.log('Registration successful:', response.data);
      alert('Registration successful!');
      // Перенаправляем пользователя на страницу логина после успешной регистрации
      navigate('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration error: ' + JSON.stringify(error));
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Teacher Name:</label>
          <input
            type="text"
            value={teacherName}
            placeholder="Enter your teacher name"
            onChange={(e) => setTeacherName(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        <p>Already have an account?</p>
        <button type="button" onClick={handleGoToLogin} className="login-btn">
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
