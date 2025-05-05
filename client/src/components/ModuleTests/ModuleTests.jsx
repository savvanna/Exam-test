import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ModuleTests.css';

// Импорт изображений для модулей
import coreImg from '../../assets/images/core.jpg';
import behaviourImg from '../../assets/images/behaviour.jpg';
import parkingImg from '../../assets/images/parking.jpg';
import emergenciesImg from '../../assets/images/emergencies.jpg';
import roadPosImg from '../../assets/images/road_position.jpg';
import intersectionImg from '../../assets/images/intersection.jpg';

const ModuleTests = () => {
  const navigate = useNavigate();

  // Массив модулей с названием, длительностью, картинкой и маршрутом перехода
  const modules = [
    { id: 1, title: "Основные", duration: 12, img: coreImg, path: '/module-tests/core' },
    { id: 2, title: "Действия на дороге", duration: 15, img: behaviourImg, path: '/module-tests/behaviour' },
    { id: 3, title: "Парковка", duration: 5, img: parkingImg, path: '/module-tests/parking' },
    { id: 4, title: "Экстренные ситуации", duration: 6, img: emergenciesImg, path: '/module-tests/emergencies' },
    { id: 5, title: "Позиции на дороге", duration: 5, img: roadPosImg, path: '/module-tests/roadrules' },
    { id: 6, title: "Перекрёстки", duration: 13, img: intersectionImg, path: '/module-tests/intersection' },
  ];

  return (
    <div className="modules-container">
      <header className="modules-header">
        <h1>Модуль-тесты</h1>
      </header>
      <div className="modules-list">
        {modules.map(mod => (
          <div key={mod.id} className="module-card">
            <img src={mod.img} alt={`${mod.title} Module`} className="module-img" />
            <h3>{mod.title}</h3>
            <p>Длительность: {mod.duration} минут</p>
            <button className="submit-btn" onClick={() => navigate(mod.path)}>
              Начать тест
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleTests;
