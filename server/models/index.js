const sequelize = require('../config/database');
const Sequelize = require('sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Teacher = require('./Teacher')(sequelize, Sequelize);
db.Student = require('./Student')(sequelize, Sequelize);
db.Exam = require('./Exam')(sequelize, Sequelize);
db.Question = require('./Question')(sequelize, Sequelize);
db.Answer = require('./Answer')(sequelize, Sequelize);
db.Result = require('./Result')(sequelize, Sequelize);

// Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;