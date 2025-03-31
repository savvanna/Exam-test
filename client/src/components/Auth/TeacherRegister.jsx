// client/src/components/Auth/TeacherRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Register.css';

const TeacherRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    try {
        await axios.post(`${baseURL}/auth/teacher/register`, {
            username,
            password,
            Email: email,
            TeacherName: teacherName,
          });
          alert('Registration successful!');
          
      navigate('/auth/teacher/login');
    } catch (err) {
      setError('Registration error: ' + JSON.stringify(err));
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth/teacher/login');
  };

  return (
    <div className="register-container">
      <h2>Teacher Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Teacher Name:</label>
          <input type="text" value={teacherName} placeholder="Enter your teacher name" onChange={(e) => setTeacherName(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        <p>Already have an account?</p>
        <button type="button" onClick={handleGoToLogin} className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default TeacherRegister;
