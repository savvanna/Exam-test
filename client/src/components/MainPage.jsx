// client/src/components/MainPage.jsx
import React from 'react';
import AuthModal from './Auth/AuthModal';
import '../styles/MainPage.css';

const MainPage = ({ setAuth }) => {
  return (
    <div className="main-container">
      <AuthModal setAuth={setAuth} />
    </div>
  );
};

export default MainPage;
