// client/src/components/Auth/AuthModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AuthModal.css';

const AuthModal = ({ setAuth }) => {
  const [activeTab, setActiveTab] = useState('login'); // "login" или "register"
  const [role, setRole] = useState('student');           // выбираем роль: teacher или student

  // Поля для логина
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Поля для регистрации
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');    // TeacherName или StudentName
  const [regGroup, setRegGroup] = useState('');  // опционально для студентов

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setError('');
    setActiveTab(tab);
  };

  // Обработчик логина
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

    try {
      const loginRoute = role === 'teacher'
        ? '/auth/teacher/login'
        : '/auth/student/login';

      const response = await axios.post(`${baseURL}${loginRoute}`, {
        Email: loginEmail,
        Password: loginPassword,
      });

      const { token } = response.data;
      if (token) {
        // Обновляем auth-стейт
        setAuth({ token, role: response.data.role });

        if (role === 'teacher') {
          const { TeacherName, Email, TeacherID } = response.data;
          localStorage.setItem('teacherName', TeacherName);
          localStorage.setItem('teacherEmail', Email);
          localStorage.setItem('teacherID', TeacherID);
          navigate('/teacher-dashboard');
        } else {
          const { StudentName, Email, RegistrationDate, groupName, studentID } = response.data;
          localStorage.setItem('studentName', StudentName);
          localStorage.setItem('studentEmail', Email);
          localStorage.setItem('registrationDate', RegistrationDate);
          localStorage.setItem('groupName', groupName);
          localStorage.setItem('studentID', studentID);
          console.log("Student token saved:", StudentName, groupName, studentID);
          navigate('/student-dashboard');
        }
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err) {
      setError('Login error: ' + JSON.stringify(err));
    }
  };

  // Обработчик регистрации + авто логин
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    try {
      const registerRoute = role === 'teacher' ? '/auth/teacher/register' : '/auth/student/register';
      const registerData =
        role === 'teacher'
          ? { password: regPassword, Email: regEmail, TeacherName: regName }
          : { password: regPassword, Email: regEmail, StudentName: regName, groupName: regGroup };

      console.log("Register data:", registerData);
      await axios.post(`${baseURL}${registerRoute}`, registerData);
      alert('Registration successful! Logging you in...');
      const loginRoute = role === 'teacher' ? '/auth/teacher/login' : '/auth/student/login';
      const response = await axios.post(`${baseURL}${loginRoute}`, { Email: regEmail, Password: regPassword });
      const { token, role: resRole } = response.data;
      console.log("Auto login response:", response.data);
      if (token) {
        setAuth({ token, role: resRole });
        if (resRole === 'teacher') {
          const { TeacherName, Email, TeacherID } = response.data;
          localStorage.setItem('teacherName', TeacherName);
          localStorage.setItem('teacherEmail', Email);
          localStorage.setItem('teacherID', TeacherID);
          navigate('/teacher-dashboard');
        } else {
          const { StudentName, Email, RegistrationDate, groupName, studentID } = response.data;
          localStorage.setItem('studentName', StudentName);
          localStorage.setItem('studentEmail', Email);
          localStorage.setItem('registrationDate', RegistrationDate);
          localStorage.setItem('groupName', groupName);
          localStorage.setItem('studentID', studentID);
          navigate('/student-dashboard');
        }
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
        {/* Кнопка закрытия удалена, чтобы окно нельзя было закрыть до авторизации */}
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
