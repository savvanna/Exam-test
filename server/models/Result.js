module.exports = (sequelize, DataTypes) => {
    const Result = sequelize.define('Result', {
      ResultID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StudentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ExamID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Score: {
        type: DataTypes.FLOAT,
      },
      DateTaken: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Result.associate = (models) => {
      Result.belongsTo(models.Student, {
        foreignKey: 'StudentID',
        as: 'student',
      });
      Result.belongsTo(models.Exam, {
        foreignKey: 'ExamID',
        as: 'exam',
      });
    };
  
    return Result;
  };