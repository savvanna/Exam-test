import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AuthModal.css';

const AuthModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('login'); // "login" или "register"
  const [role, setRole] = useState('student'); // выбираем роль: teacher или student

  // Поля для логина
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Поля для регистрации
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState(''); // либо TeacherName, либо StudentName

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setError('');
    setActiveTab(tab);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    try {
      // URL зависит от выбранной роли
      const loginRoute = role === 'teacher' ? '/auth/teacher/login' : '/auth/student/login';
      const response = await axios.post(`${baseURL}${loginRoute}`, { Email: loginEmail, Password: loginPassword });
      const { token, role: resRole } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', resRole);
        onClose();
        if (resRole === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err) {
      setError('Login error: ' + JSON.stringify(err));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    try {
      // URL зависит от выбранной роли
      const registerRoute = role === 'teacher' ? '/auth/teacher/register' : '/auth/student/register';
      await axios.post(`${baseURL}${registerRoute}`, {
        username: regUsername,
        password: regPassword,
        Email: regEmail,
        ...(role === 'teacher' ? { TeacherName: regName } : { StudentName: regName }),
      });
      alert('Registration successful!');
      // После успешной регистрации переключаемся на логин
      setActiveTab('login');
    } catch (err) {
      setError('Registration error: ' + JSON.stringify(err));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="tabs">
          <button 
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button 
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="Enter your email" 
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder="Enter your password" 
                required
              />
            </div>
            <button type="submit" className="submit-btn">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input 
                type="text" 
                value={regUsername} 
                onChange={(e) => setRegUsername(e.target.value)} 
                placeholder="Enter username" 
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={regEmail} 
                onChange={(e) => setRegEmail(e.target.value)} 
                placeholder="Enter your email" 
                required
              />
            </div>
            <div className="form-group">
              <label>{role === 'teacher' ? 'Teacher Name:' : 'Student Name:'}</label>
              <input 
                type="text" 
                value={regName} 
                onChange={(e) => setRegName(e.target.value)} 
                placeholder={role === 'teacher' ? 'Enter teacher name' : 'Enter student name'} 
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={regPassword} 
                onChange={(e) => setRegPassword(e.target.value)} 
                placeholder="Enter your password" 
                required
              />
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
