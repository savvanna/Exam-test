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
      QuestionType: {
        type: DataTypes.STRING,
      },
      QuestionText: {
        type: DataTypes.TEXT,
      },
      CorrectAnswer: {
        type: DataTypes.STRING,
      },
      ImageURL: {
        type: DataTypes.STRING,
      },
    });
  
    Question.associate = (models) => {
      Question.belongsTo(models.Exam, {
        foreignKey: 'ExamID',
        as: 'exam',
      });
      Question.hasMany(models.Answer, {
        foreignKey: 'QuestionID',
        as: 'answers',
      });
    };
  
    return Question;
  };