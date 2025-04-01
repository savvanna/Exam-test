// client/src/components/Auth/AuthModal.jsx
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

  // Поля для регистрации (без username)
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState(''); // TeacherName или StudentName
  const [regGroup, setRegGroup] = useState(''); // Опционально для студентов

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setError('');
    setActiveTab(tab);
  };

  // Пример обработчика логина для студента в AuthModal.jsx
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  
    try {
      // Определяем нужный endpoint в зависимости от роли
      const loginRoute = role === 'teacher' 
        ? '/auth/teacher/login' 
        : '/auth/student/login';
  
      // Отправляем POST-запрос с теми же ключами, что и в Postman
      const response = await axios.post(`${baseURL}${loginRoute}`, {
        Email: loginEmail,
        Password: loginPassword,
      });
  
      // Если сервер возвращает токен, продолжаем авторизацию
      const { token } = response.data;
  
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', response.data.role); // либо resRole
  
        if (role === 'teacher') {
          // Для учителя ожидаем TeacherName, Subject, Email и т.п.
          const { TeacherName, Email, Subject } = response.data;
          localStorage.setItem('teacherName', TeacherName);
          localStorage.setItem('teacherEmail', Email);
          localStorage.setItem('subject', Subject);
          console.log("Teacher token saved, teacherName:", TeacherName, "Subject:", Subject);
          navigate('/teacher-dashboard');
        } else {
          // Для студента ожидаем StudentName, RegistrationDate, GroupName, Email и т.п.
          const { StudentName, Email, RegistrationDate, GroupName } = response.data;
          localStorage.setItem('studentName', StudentName);
          localStorage.setItem('studentEmail', Email);
          localStorage.setItem('registrationDate', RegistrationDate);
          localStorage.setItem('groupName', GroupName);
          console.log("Student token saved, studentName:", StudentName, "GroupName:", GroupName);
          navigate('/student-dashboard');
        }
        onClose();
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
      const registerRoute = role === 'teacher' ? '/auth/teacher/register' : '/auth/student/register';
      // Формируем данные регистрации без username, поле зависит от роли
      const registerData =
        role === 'teacher'
          ? { password: regPassword, Email: regEmail, TeacherName: regName }
          : { password: regPassword, Email: regEmail, StudentName: regName, groupName: regGroup };

      console.log("Register data:", registerData);
      await axios.post(`${baseURL}${registerRoute}`, registerData);
      alert('Registration successful! Logging you in...');
      // Автоматически выполняем логин после регистрации:
      const loginRoute = role === 'teacher' ? '/auth/teacher/login' : '/auth/student/login';
      const response = await axios.post(`${baseURL}${loginRoute}`, { Email: regEmail, Password: regPassword });
      const { token, role: resRole } = response.data;
      console.log("Auto login response:", response.data);
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', resRole);
        navigate(resRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        onClose();
      } else {
        setError('Auto login failed: Invalid credentials');
      }
    } catch (err) {
      console.error('Registration error:', err);
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
            {role === 'student' && (
              <div className="form-group">
                <label>Group:</label>
                <input 
                  type="text" 
                  value={regGroup}
                  onChange={(e) => setRegGroup(e.target.value)}
                  placeholder="Enter your group" 
                />
              </div>
            )}
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
