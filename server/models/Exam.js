module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define('Exam', {
      ExamID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      TeacherID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Exam.associate = (models) => {
      Exam.belongsTo(models.Teacher, {
        foreignKey: 'TeacherID',
        as: 'teacher',
      });
      Exam.hasMany(models.Question, {
        foreignKey: 'ExamID',
        as: 'questions',
      });
      Exam.hasMany(models.Result, {
        foreignKey: 'ExamID',
        as: 'results',
      });
    };
  
    return Exam;
  };