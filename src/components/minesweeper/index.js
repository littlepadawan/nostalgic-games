import React, { useState, useEffect } from "react";
import MsCell from "./MsCell";
import ModeSwitch from "./ModeSwitch";
import StatusBar from "./../StatusBar";
import * as utils from "./../../utils";
import * as helpers from "./helpers";
import "./index.css";

function Minesweeper() {
  const [grid, setGrid] = useState(helpers.generateGrid());
  const [win, setWin] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isMarkMode, setIsMarkMode] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const cells = [];

  //  Updates elapsed time every second
  useEffect(() => {
    if (startTime !== 0 && !win && !gameOver) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, win, gameOver]);

  for (let y = 0; y < helpers.height; y++) {
    for (let x = 0; x < helpers.width; x++) {
      cells.push(
        <MsCell
          {...grid[y * helpers.width + x]}
          minesAround={helpers.calculateMinesAround(grid, x, y)}
          key={`${y} ${x}`}
          onClick={() =>
            isMarkMode ? onCellRightClick(x, y) : onCellClick(x, y)
          }
          onRightClick={() => onCellRightClick(x, y)}
        ></MsCell>
      );
    }
  }

  function onCellClick(x, y) {
    // Disable click if game is won or game over
    if (win || gameOver) return;

    // Will run on first click
    if (startTime === 0) setStartTime(Date.now());

    setGrid((oldGrid) => {
      let newGrid = helpers.openCells(oldGrid, x, y);
      if (oldGrid[y * helpers.width + x].isMine) {
        setGameOver(true);
        newGrid = helpers.openAllMines(newGrid);
        console.log("Game over");
      } else if (helpers.isWin(newGrid)) {
        setWin(true);
        console.log("You win");
      }
      return newGrid;
    });
  }

  function onCellRightClick(x, y) {
    if (win || gameOver) return;
    // Will run on first click
    if (startTime === 0) setStartTime(Date.now());
    setGrid((oldGrid) => helpers.markCell(oldGrid, x, y));
  }

  return (
    <div className="game-container">
      <StatusBar
        status1={`Time: ${utils.prettifyTime(elapsedTime)}`}
        status2={`Mines left: ${
          gameOver ? `0` : helpers.mines - helpers.getMarkedCells(grid)
        }`}
      ></StatusBar>
      <div className="ms-grid">{cells}</div>
      <ModeSwitch
        isMarkMode={isMarkMode}
        onChange={() => setIsMarkMode(!isMarkMode)}
      />
    </div>
  );
}

export default Minesweeper;
