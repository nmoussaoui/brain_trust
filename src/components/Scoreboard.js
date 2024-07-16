import React from 'react';

const Scoreboard = ({ score, teamPlay }) => {
  return (
    <div>
      <h2>Scores</h2>
      {Object.keys(score).map((key) => (
        <p key={key}>{teamPlay ? `Équipe ${key}` : key} : {score[key]}</p>
      ))}
    </div>
  );
};

export default Scoreboard;
