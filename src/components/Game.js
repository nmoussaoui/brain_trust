import React, { useState, useEffect, useCallback } from "react";
import Question from "./Question";
import Scoreboard from "./Scoreboard";
import PlayerInput from "./PlayerInput";
import questionsData from "../questions.json"; // Importer les questions depuis le fichier JSON
import "../styles/Game.css"; // Assurez-vous d'importer le fichier CSS

const Game = ({ players, teams }) => {
  const [score, setScore] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [theme, setTheme] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [timeLeft, setTimeLeft] = useState(60); // Temps initialisé à 60 secondes
  const [usedThemes, setUsedThemes] = useState([]); // Nouvel état pour les thèmes utilisés
  const teamPlay = teams.length > 0;

  const initializeScores = useCallback(() => {
    const initialScore = teamPlay
      ? teams.reduce((acc, team) => {
          acc[team.name] = 0;
          return acc;
        }, {})
      : players.reduce((acc, player) => {
          acc[player.name] = 0;
          return acc;
        }, {});
    setScore(initialScore);
  }, [players, teams, teamPlay]);

  const selectTheme = useCallback(() => {
    const themes = questionsData.map((q) => q.category);
    const availableThemes = themes.filter((theme) => !usedThemes.includes(theme));
    if (availableThemes.length === 0) {
      // Si tous les thèmes ont été utilisés, réinitialiser la liste
      setUsedThemes([]);
      setTheme(themes[Math.floor(Math.random() * themes.length)]);
    } else {
      const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
      setTheme(randomTheme);
    }
  }, [usedThemes]);

  useEffect(() => {
    initializeScores();
    selectTheme();
  }, [initializeScores, selectTheme]);

  const handleScoreUpdate = useCallback(
    (points) => {
      setScore((prevScore) => {
        const newScore = { ...prevScore };
        if (teamPlay) {
          newScore[teams[currentTeamIndex].name] += points;
        } else {
          newScore[players[currentPlayerIndex].name] += points;
        }
        return newScore;
      });
      if (teamPlay) {
        setCurrentTeamIndex((prevIndex) => (prevIndex + 1) % teams.length);
      } else {
        setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
      }
      setConfidence(5); // Reset the confidence for the next player
      setCurrentQuestion(null); // Reset the current question

      setUsedThemes((prevUsedThemes) => {
        const updatedThemes = [...prevUsedThemes, theme]; // Ajouter le thème utilisé à la liste
        const themes = questionsData.map((q) => q.category);
        const availableThemes = themes.filter((theme) => !updatedThemes.includes(theme));
        const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
        setTheme(randomTheme); // Select a new theme for the next player/team
        return updatedThemes;
      });
    },
    [teamPlay, currentTeamIndex, currentPlayerIndex, players, teams, theme]
  );

  const handleTimesUp = useCallback(() => {
    handleScoreUpdate(0); // Pas de points si le temps est écoulé
  }, [handleScoreUpdate]);

  useEffect(() => {
    if (confidence !== null && currentQuestion) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimesUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [confidence, currentQuestion, handleTimesUp]);

  const getNextQuestion = (confidence) => {
    const category = questionsData.find((q) => q.category === theme);
    const filteredQuestions = category.questions.filter((q) => q.difficulty === confidence);
    if (filteredQuestions.length > 0) {
      const question = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setCurrentQuestion(question);
      setTimeLeft(60); // Réinitialiser le temps à 60 secondes
    } else {
      setCurrentQuestion(null); // Si aucune question n'est trouvée pour ce niveau de confiance
    }
  };

  const handleOptionClick = (option) => {
    if (option === currentQuestion.answer) {
      handleScoreUpdate(confidence);
    } else {
      handleScoreUpdate(0);
    }
  };

  let timerClass = "timer";
  if (timeLeft <= 10) {
    timerClass += " impact";
  } else if (timeLeft <= 20) {
    timerClass += " less-than-20";
  } else if (timeLeft <= 30) {
    timerClass += " less-than-30";
  }

  return (
    <div className="container">
      <button className="quit-button">Quitter</button>
      <Scoreboard score={score} teamPlay={teamPlay} />
      <h2 className="theme">Thème : {theme}</h2>
      <p className="current-player">
        {teamPlay ? `Équipe ${teams[currentTeamIndex].name} à vous de jouer` : `Joueur ${players[currentPlayerIndex].name} à vous de jouer`}
      </p>
      {!currentQuestion && (
        <div className="confidence-container">
          <p className="confidence-label">Confiance</p>
          <div className="confidence-buttons">
            {confidence < 10 && (
              <button className="confidence-button" onClick={() => setConfidence((prev) => Math.min(prev + 1, 10))}>
                ▲
              </button>
            )}
            <div className="confidence-value">{confidence}</div>
            {confidence > 1 && (
              <button className="confidence-button" onClick={() => setConfidence((prev) => Math.max(prev - 1, 1))}>
                ▼
              </button>
            )}
          </div>
          <button className="validate-button" onClick={() => getNextQuestion(confidence)}>
            Valider
          </button>
        </div>
      )}
      {currentQuestion && (
        <div>
          <Question currentQuestion={currentQuestion} />
          <p className={timerClass}>Temps restant : {timeLeft} secondes</p>
          {currentQuestion.options ? (
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <button key={index} className="option-button" onClick={() => handleOptionClick(option)}>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <PlayerInput
              currentPlayer={teamPlay ? teams[currentTeamIndex] : players[currentPlayerIndex]}
              handleScoreUpdate={handleScoreUpdate}
              answerRequired={true}
              currentQuestion={currentQuestion}
              confidence={confidence}
              teamPlay={teamPlay}
              timeLeft={timeLeft} // Passer le temps restant au composant PlayerInput
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
