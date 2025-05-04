const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Настроим хранилище файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Сохраняем с уникальным именем
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// POST /upload - загрузка изображения
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Изображение не получено' });
  }
  // Формируем URL для доступа к изображению. Предположим, у вас настроена выдача статичных файлов из server/uploads
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
