module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
      AnswerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      QuestionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AnswerText: {
        type: DataTypes.STRING,
      },
      IsCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    Answer.associate = (models) => {
      Answer.belongsTo(models.Question, {
        foreignKey: 'QuestionID',
        as: 'question',
      });
    };
  
    return Answer;
  };