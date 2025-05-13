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
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedExams: { 
      // Хранение назначенных экзаменов как JSON (массив)
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
