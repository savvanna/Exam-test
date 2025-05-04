// server/models/question.js
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    QuestionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ExamID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Answers: { // Хранит варианты ответов в формате JSON (ключи: "A", "B", ...)
      type: DataTypes.JSON,
      allowNull: false,
    },
    CorrectAnswer: { // Например, "A"
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Добавляем новое поле для хранения URL изображения
    Image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Exam, {
      foreignKey: 'ExamID',
      as: 'exam',
    });
  };

  return Question;
};
