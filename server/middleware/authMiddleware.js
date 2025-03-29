// authMiddleware.js
const dotenv = require('dotenv');

dotenv.config(); // Загружаем переменные окружения

// При необходимости можно установить тестового пользователя,
// чтобы в других обработчиках не возникало ошибок из-за отсутствия req.user.
module.exports = (req, res, next) => {
  console.log('Bypassing token authentication (development mode)');

  // Если в дальнейшем логике ожидаются данные о пользователе,
  // можно прописать их здесь (например, для тестирования):
  req.userId = 1;           // Установите здесь любой тестовый идентификатор
  req.userRole = 'teacher'; // Или другую роль, если требуется
  req.user = { userId: 1, role: 'teacher' };

  // Пропускаем запрос дальше
  next();
};
