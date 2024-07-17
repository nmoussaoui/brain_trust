import React, { useState } from 'react';
import '../styles/Setup.css';

const Setup = ({ startGame }) => {
  const [playerNames, setPlayerNames] = useState(['']);
  const [teamPlay, setTeamPlay] = useState(false);
  const [teamNames, setTeamNames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handlePlayerNameChange = (index, name) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const addPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const removePlayer = (index) => {
    const newPlayerNames = playerNames.filter((_, i) => i !== index);
    setPlayerNames(newPlayerNames);
  };

  const handleTeamNameChange = (index, name) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const addTeam = () => {
    const newTeamId = `team-${teams.length + 1}`;
    const newTeam = { id: newTeamId, name: '', players: [] };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (index) => {
    const teamId = teams[index].id;
    const newTeams = teams.filter((_, i) => i !== index);
    const newPlayers = players.map(player => 
      player.team === teamId ? { ...player, team: null } : player
    );
    setTeams(newTeams);
    setPlayers(newPlayers);
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

  const removePlayerFromTeam = (playerId) => {
    const newPlayers = players.map(player =>
      player.id === playerId ? { ...player, team: null } : player
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
          <h1 className="title-setup">Configuration du Jeu</h1>
          <div className="player-container">
            {playerNames.map((name, index) => (
              <div className="player" key={index}>
                <div className="avatar">{index + 1}</div>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Nom du Joueur ${index + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                />
                {index > 0 && (
                  <button className="remove-button" onClick={() => removePlayer(index)}>X</button>
                )}
              </div>
            ))}
            <div className="add-button" onClick={addPlayer}>+</div>
          </div>
          <button className="btn btn-primary" onClick={setupPlayers}>Suivant</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h1 className="title-setup">Configuration</h1>
          <button className="btn btn-secondary me-2" onClick={() => { setTeamPlay(false); handleStartGame(); }}>Seul</button>
          <button className="btn btn-secondary" onClick={() => { setTeamPlay(true); setCurrentStep(3); }}>Équipe</button>
        </div>
      )}

      {currentStep === 3 && teamPlay && (
        <div>
          <h1 className="title-setup">Configuration des Équipes</h1>
          <div className="team-container">
            {teams.map((team, index) => (
              <div className="team" key={team.id}>
                <input
                  type="text"
                  className="form-control team-name"
                  placeholder={`Nom de l'Équipe ${index + 1}`}
                  value={teamNames[index] || ''}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                />
                <div className="player-container">
                  {players.filter(player => player.team === team.id).map(player => (
                    <div className="player" key={player.id}>
                      <div className="avatar">{player.id}</div>
                      <div className="player-name">{player.name}</div>
                      <button className="remove-button" onClick={() => removePlayerFromTeam(player.id)}>X</button>
                    </div>
                  ))}
                  <select
                    className="form-control"
                    onChange={(e) => handlePlayerTeamChange(e.target.value, team.id)}
                  >
                    <option value="">Ajouter un joueur</option>
                    {players.filter(player => player.team === null).map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <button className="remove-button" onClick={() => removeTeam(index)}>X</button>
              </div>
            ))}
            <div className="add-button" onClick={addTeam}>+</div>
          </div>
          <button className="btn btn-primary" onClick={handleStartGame}>Commencer le Jeu</button>
        </div>
      )}
    </div>
  );
};

export default Setup;
