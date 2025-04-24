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
    Answers: { // Хранит варианты ответов в формате JSON (ключи: "A", "B" и т.д.)
      type: DataTypes.JSON,
      allowNull: false,
    },
    CorrectAnswer: { // Новое поле для хранения правильного ответа (например, "A")
      type: DataTypes.STRING,
      allowNull: false,
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
