import React, { useState } from 'react';

const Setup = ({ startGame }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState([]);
  const [teamPlay, setTeamPlay] = useState(false);
  const [numTeams, setNumTeams] = useState(2);
  const [teamNames, setTeamNames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handlePlayerNameChange = (index, name) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleTeamNameChange = (index, name) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const setupPlayers = () => {
    const initialPlayers = playerNames.map((name, index) => ({
      id: `player-${index + 1}`,
      name: name || `Joueur ${index + 1}`,
      team: null,
    }));
    setPlayers(initialPlayers);
    setCurrentStep(2);
  };

  const setupTeams = () => {
    const initialTeams = Array.from({ length: numTeams }, (_, index) => ({
      id: `team-${index + 1}`,
      name: teamNames[index] || `Équipe ${index + 1}`,
      players: [],
    }));
    setTeams(initialTeams);
    setCurrentStep(4);
  };

  const handlePlayerTeamChange = (playerId, teamId) => {
    const newPlayers = players.map(player =>
      player.id === playerId ? { ...player, team: teamId } : player
    );
    setPlayers(newPlayers);

    const newTeams = teams.map(team => ({
      ...team,
      players: newPlayers.filter(player => player.team === team.id),
    }));
    setTeams(newTeams);
  };

  const handleStartGame = () => {
    startGame(players, teams);
  };

  return (
    <div className="container">
      {currentStep === 1 && (
        <div>
          <h1>Configuration du Jeu</h1>
          <div className="mb-3">
            <label className="form-label">Nombre de Joueurs :</label>
            <input
              type="number"
              className="form-control"
              value={numPlayers}
              onChange={(e) => setNumPlayers(Number(e.target.value))}
              min="2"
              max="10"
            />
          </div>
          {Array.from({ length: numPlayers }).map((_, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">Nom du Joueur {index + 1} :</label>
              <input
                type="text"
                className="form-control"
                value={playerNames[index] || ''}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
            </div>
          ))}
          <button className="btn btn-primary" onClick={setupPlayers}>Suivant</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h1>Jouer en équipe ou seul ?</h1>
          <button className="btn btn-secondary me-2" onClick={() => { setTeamPlay(false); handleStartGame(); }}>Seul</button>
          <button className="btn btn-secondary" onClick={() => { setTeamPlay(true); setCurrentStep(3); }}>Équipe</button>
        </div>
      )}

      {currentStep === 3 && teamPlay && (
        <div>
          <h1>Configuration des Équipes</h1>
          <div className="mb-3">
            <label className="form-label">Nombre d'Équipes :</label>
            <input
              type="number"
              className="form-control"
              value={numTeams}
              onChange={(e) => setNumTeams(Number(e.target.value))}
              min="2"
              max="10"
            />
          </div>
          {Array.from({ length: numTeams }).map((_, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">Nom de l'Équipe {index + 1} :</label>
              <input
                type="text"
                className="form-control"
                value={teamNames[index] || ''}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
              />
            </div>
          ))}
          <button className="btn btn-primary" onClick={setupTeams}>Suivant</button>
        </div>
      )}

      {currentStep === 4 && teamPlay && (
        <div>
          <h1>Répartition des Joueurs dans les Équipes</h1>
          {teams.map((team, index) => (
            <div key={team.id} className="mb-3">
              <h3>{team.name}</h3>
              {players.filter(player => player.team === team.id).map(player => (
                <div key={player.id}>{player.name}</div>
              ))}
              <select className="form-select" onChange={(e) => handlePlayerTeamChange(e.target.value, team.id)}>
                <option value="">Ajouter un joueur</option>
                {players.filter(player => player.team === null).map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </div>
          ))}
          <button className="btn btn-success" onClick={handleStartGame}>Commencer le Jeu</button>
        </div>
      )}
    </div>
  );
};

export default Setup;
