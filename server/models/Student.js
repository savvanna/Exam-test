// server/models/Student.js
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    RegistrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StudentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupName: {
      // Поле для хранения информации о группе студента. Может быть null, если группа не указана.
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedExams: { 
      // Новое поле — хранит список ID назначенных экзаменов
      type: DataTypes.JSON,
      defaultValue: [],
    },
  });

  Student.associate = (models) => {
    Student.hasMany(models.Result, {
      foreignKey: 'StudentID',
      as: 'results',
    });
  };

  return Student;
};
