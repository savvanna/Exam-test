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
      unique: true, // Email должен быть уникальным
      validate: {
        isEmail: true,
      },
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TeacherName: {
      type: DataTypes.STRING,
      allowNull: false,
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
