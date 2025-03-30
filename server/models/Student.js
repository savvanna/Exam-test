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
    });
  
    Student.associate = (models) => {
      Student.hasMany(models.Result, {
        foreignKey: 'StudentID',
        as: 'results',
      });
    };
  
    return Student;
  };