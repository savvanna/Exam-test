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
      allowNull: false,
      defaultValue: 0,
    },
    Total: {  // Добавляем поле Total
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    DateTaken: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Result.associate = (models) => {
    Result.belongsTo(models.Student, {
      foreignKey: 'StudentID',
      as: 'student',  // alias обязательно в нижнем регистре
    });
    Result.belongsTo(models.Exam, {
      foreignKey: 'ExamID',
      as: 'exam',     // alias обязательно в нижнем регистре
    });
  };

  return Result;
};
