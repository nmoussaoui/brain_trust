import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import HomePage from './components/HomePage';
import Setup from './components/Setup';
function App() {
  const [currentStep, setCurrentStep] = useState('home');
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  const startSetup = () => {
    setCurrentStep('setup');
  };

  const startGame = (players, teams) => {
    setPlayers(players);
    setTeams(teams);
    setCurrentStep('game');
  };

  return (
    <div className="App">
      {currentStep === 'home' && <HomePage startSetup={startSetup} />}
      {currentStep === 'setup' && <Setup startGame={startGame} />}
      {currentStep === 'game' && <Game players={players} teams={teams} />}
    </div>
  );
}

export default App;
