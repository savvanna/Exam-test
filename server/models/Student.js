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
      // Новое поле для хранения информации о группе студента.
      // Можно использовать null, если группа не указана.
      type: DataTypes.STRING,
      allowNull: true,
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
