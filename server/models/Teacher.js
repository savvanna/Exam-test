module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    TeacherID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    Subject: {
      type: DataTypes.STRING,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TeacherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: { // Добавляем поле username
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Убедитесь, что имена пользователей уникальны
    },
  });

  Teacher.associate = (models) => {
    Teacher.hasMany(models.Exam, {
      foreignKey: 'TeacherID',
      as: 'exams',
    });
  };

  return Teacher;
};