import React, { useState } from 'react';

const PlayerInput = ({
  currentPlayer,
  handleScoreUpdate,
  setConfidence,
  getNextQuestion,
  answerRequired,
  currentQuestion,
  confidence,
  teamPlay,
  timeLeft
}) => {
  const [localConfidence, setLocalConfidence] = useState(0);
  const [answer, setAnswer] = useState('');

  const handleConfidenceSubmit = () => {
    setConfidence(localConfidence);
    getNextQuestion(localConfidence);
    setLocalConfidence(0); // Reset the local confidence
  };

  const handleAnswerSubmit = () => {
    // Valider la réponse (ici, on suppose que la validation est simplifiée)
    const correctAnswer = currentQuestion.answer.toLowerCase();
    const points = answer.toLowerCase() === correctAnswer ? confidence : 0;
    handleScoreUpdate(points);
    setAnswer(''); // Reset the answer input
  };

  return (
    <div>
      {answerRequired ? (
        <div>
          <h3>{teamPlay ? currentPlayer.name : currentPlayer.name}, à vous de répondre :</h3>
          <label>
            Votre réponse :
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={timeLeft <= 0}
            />
          </label>
          <br />
          <button onClick={handleAnswerSubmit} disabled={timeLeft <= 0}>Soumettre</button>
        </div>
      ) : (
        <div>
          <h3>{teamPlay ? currentPlayer.name : currentPlayer.name}, à vous de jouer :</h3>
          <label>
            Notez votre confiance (1-10) :
            <input
              type="number"
              value={localConfidence}
              onChange={(e) => setLocalConfidence(Number(e.target.value))}
              min="1"
              max="10"
            />
          </label>
          <br />
          <button onClick={handleConfidenceSubmit}>Soumettre</button>
        </div>
      )}
    </div>
  );
};

export default PlayerInput;
