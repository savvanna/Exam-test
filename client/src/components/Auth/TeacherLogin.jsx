// client/src/components/Auth/TeacherLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${baseURL}/auth/teacher/login`, { Email: email, Password: password });
      const { token, role } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/teacher-dashboard');
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err) {
      setError('Login error: ' + JSON.stringify(err));
    }
  };

  const handleGoToRegister = () => {
    navigate('/auth/teacher/register');
  };

  return (
    <div className="login-container">
      <h2>Teacher Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        <p>Don't have an account?</p>
        <button type="button" onClick={handleGoToRegister} className="register-btn">Register</button>
      </div>
    </div>
  );
};

export default TeacherLogin;
