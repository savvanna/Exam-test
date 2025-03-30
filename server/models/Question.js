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
    Answers: { // Храним ответы как JSON
      type: DataTypes.JSON,
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