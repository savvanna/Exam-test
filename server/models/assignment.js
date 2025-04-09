// server/models/assignment.js
module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
      assignmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Например, связываем с экзаменом
      examId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Связываем с конкретным студентом (если назначение индивидуально)
      StudentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Дата назначения
      assignedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    });
  
    Assignment.associate = (models) => {
      Assignment.belongsTo(models.Exam, {
        foreignKey: 'examId',
        as: 'exam'
      });
      // Если у вас есть модель Student
      Assignment.belongsTo(models.Student, {
        foreignKey: 'StudentID',
        as: 'student'
      });
    };
  
    return Assignment;
  };
  