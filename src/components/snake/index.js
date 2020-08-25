import React, { useState, useEffect } from "react";
import "./index.css";
import * as helpers from "./helpers";
import * as utils from "../../utils";
import StatusBar from "../StatusBar";
import ResultModal from "../ResultModal";
import TouchController from "./TouchController";

function Snake() {
  const [game, setGame] = useState(helpers.generateGame());
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scoreCanBeSaved, setScoreCanBeSaved] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    //Guarding code below from running when it shouldnt (not run when game over is true)
    if (gameOver) return;
    const intervalId = setInterval(
      () =>
        setGame((oldGame) => {
          const newGame = helpers.tick(oldGame);
          if (helpers.isGameOver(newGame)) {
            setGameOver(true);
            setShowModal(true);
            setScoreCanBeSaved(true);
            console.log("You lose :(");
            return oldGame;
          }
          return newGame;
        }),
      400
    );
    return () => clearInterval(intervalId);
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameOver, startTime]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  function handleKeyPress(event) {
    let newDir;
    switch (event.keyCode) {
      case 37:
      case 65:
        newDir = "left";
        break;
      case 38:
      case 87:
        newDir = "up";
        break;
      case 39:
      case 68:
        newDir = "right";
        break;
      case 40:
      case 83:
        newDir = "down";
        break;
    }
    if (newDir) {
      setGame((oldGame) => {
        return {
          ...oldGame,
          commands: [...oldGame.commands, newDir],
        };
      });
    }
  }

  function addCommand(dir) {
    setGame((oldGame) => {
      return {
        ...oldGame,
        commands: [...oldGame.commands, dir],
      };
    });
  }

  function onRestart() {
    setGameOver(false);
    setGame(helpers.generateGame());
    setScoreCanBeSaved(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  }

  const cells = [];
  for (let y = 0; y < helpers.height; y++) {
    for (let x = 0; x < helpers.width; x++) {
      // same as x: x, y:y
      const cell = { x, y };
      let className = "";
      if (helpers.isEqual(cell, game.snake.head)) {
        className = " head";
      } else if (helpers.isEqual(cell, game.food)) {
        className = " food";
      } else if (
        game.snake.tail.some((tailCell) => helpers.isEqual(cell, tailCell))
      ) {
        className = " tail";
      }
      cells.push(
        <div key={x + "-" + y} className={"snake-cell" + className}></div>
      );
    }
  }

  return (
    <div className="game-container">
      <StatusBar
        status1={`Score: ${helpers.getScore(game)}`}
        status2={`Time: ${utils.prettifyTime(elapsedTime)}`}
        onRestart={onRestart}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="snake-grid">{cells}</div>
      <TouchController onChangeDir={addCommand} />
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        header={gameOver ? "Game over!" : "Leaderboard"}
        body={gameOver ? `Your score was ${helpers.getScore(game)}.` : ""}
        fetchLeaderboard={helpers.fetchLeaderboard}
        saveScore={(name) =>
          helpers
            .saveScore(name, helpers.getScore(game), elapsedTime)
            .then(() => setScoreCanBeSaved(false))
        }
        scoreCanBeSaved={scoreCanBeSaved}
      ></ResultModal>
    </div>
  );
}

export default Snake;
