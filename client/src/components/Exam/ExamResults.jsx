// client/src/components/Exam/ExamResults.jsx
import React from 'react';
import '../../styles/ExamResults.css';

const ExamResults = ({ results, role }) => {

  const renderHeader = () => {
    if (role === 'teacher') {
      return (
        <tr>
          <th>Название экзамена</th>
          <th>Имя студента</th>
          <th>Результат (%)</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>Название экзамена</th>
          <th>Имя преподавателя</th>
          <th>Результат (%)</th>
        </tr>
      );
    }
  };

  const renderRow = (res) => {
    const percentage = res.Total > 0 ? Math.round((res.Score / res.Total) * 100) : 0;
    if (role === 'teacher') {
      return (
        <tr key={res.ResultID}>
          <td>{res.ExamTitle}</td>
          <td>{res.StudentName || 'N/A'}</td>
          <td>{percentage}%</td>
        </tr>
      );
    } else {
      return (
        <tr key={res.ResultID}>
          <td>{res.ExamTitle}</td>
          <td>{res.TeacherName || 'N/A'}</td>
          <td>{percentage}%</td>
        </tr>
      );
    }
  };

  return (
    <div className="exam-results-container">
      <h2>Результаты экзаменов</h2>
      {results.length === 0 ? (
        <p>Нет результатов для отображения.</p>
      ) : (
        <table className="exam-results-table">
          <thead>{renderHeader()}</thead>
          <tbody>{results.map(renderRow)}</tbody>
        </table>
      )}
    </div>
  );
};

export default ExamResults;
