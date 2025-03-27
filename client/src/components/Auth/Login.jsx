import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending request to:', '/auth/login'); // Проверяем URL
    try {
      const response = await axios.post('/auth/login', { Email: email, Password: password });
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
      setError('Login error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;