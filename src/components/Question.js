import React from 'react';

const Question = ({ currentQuestion }) => {
  return (
    <div>
      <h2>Question :</h2>
      {currentQuestion ? (
        <p>{currentQuestion.question}</p>
      ) : (
        <p>Aucune question pour le moment.</p>
      )}
    </div>
  );
};

export default Question;
