import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Используем переменную окружения для базового URL API
    const baseURL = process.env.REACT_APP_API_BASE_URL || ''; // Если переменная не установлена, используется пустая строка
    console.log('Sending request to:', `${baseURL}/auth/login`);
    try {
      const response = await axios.post(`${baseURL}/auth/login`, { Email: email, Password: password });
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        console.log('Login successful, token:', token, 'role:', role);
        navigate('/create-exam');
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login error: ' + JSON.stringify(error));
    }
  };

  const handleGoToRegister = () => {
    navigate('/auth/register');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Введите email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="Введите пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        <p>Don't have an account?</p>
        <button type="button" onClick={handleGoToRegister} className="register-btn">
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
