const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Загружаем переменные окружения из .env файла

// Проверяем, установлен ли JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.  Exiting.');
  process.exit(1); // Завершаем процесс с кодом ошибки
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader); // Добавьте эту строку

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const [bearer, token] = authHeader.split(' ');
  console.log('Bearer:', bearer, 'Token:', token); // Добавьте эту строку

  if (bearer !== 'Bearer' || !token) {
    return res.status(400).json({ message: 'Invalid token format.  Expected "Bearer <token>".' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired.' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token.' });
      } else {
        return res.status(403).json({ message: 'Failed to authenticate token.' });
      }
    }

    console.log('Decoded token:', decoded); // Добавьте эту строку
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;

// Пример использования (в вашем app.js или другом файле маршрутов)
// const authMiddleware = require('./authMiddleware');
// app.get('/protected', authMiddleware, (req, res) => { ... });