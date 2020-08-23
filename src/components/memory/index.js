import React, { useState, useEffect, useRef } from "react";
import StatusBar from "../StatusBar";
import MemoryCard from "./MemoryCard";
import ResultModal from "../ResultModal";
import * as helpers from "./helpers";
import * as utils from "../../utils";
import "./index.css";

function Memory() {
  // [<current state>, <function to update stare>] = useState(<initial state>) (Gives initial state of the component)
  // expecting array returned by useState, and you define the first two elements
  const [game, setGame] = useState({
    cards: helpers.generateCards(),
    firstCard: undefined,
  });

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wrongPair, setWrongPair] = useState(null);
  const [scoreCanBeSaved, setScoreCanBeSaved] = useState(false);
  const [clickDisabled, setClickDisabled] = useState(false);

  const timeoutIds = useRef([]); // typ som useState men komponenten rederar inte om

  // useEffect(<effect function>, <dependency array (optional)>)
  //<dependency array> :
  // *undefined: effect will run on every render
  // emnpty array: effect will run only on the first render
  // * array with values: effect will run when any of the values chang
  // effect function returns a cleanup function (optional) that runs next time the effect function is run OR when the component unmounts (disappears from the DOM)
  useEffect(() => {
    if (startTime !== 0 && !win) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, win]);

  useEffect(() => {
    if (win) {
      setShowModal(true);
      setScoreCanBeSaved(true);
    }
  }, [win]);

  useEffect(() => {
    if (!wrongPair) return;
    setClickDisabled(true);
    const timeoutId = setTimeout(() => {
      setGame((oldGame) => {
        return {
          ...oldGame,
          cards: helpers.flipCards(
            oldGame.cards,
            wrongPair.map((card) => card.key)
          ),
        };
      });
      setClickDisabled(false);
    }, 1000);
    timeoutIds.current = timeoutIds.current.concat(timeoutId);
  }, [wrongPair]);

  // Can be removed once we have added logic for disable to click more than two cards?
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  function onCardClicked(clickedCard) {
    if (clickDisabled) return;
    setGame((oldGame) =>
      helpers.calculateNewGame(
        oldGame,
        clickedCard,
        () => setWin(true),
        setWrongPair
      )
    );

    if (startTime === 0) setStartTime(Date.now());
  }

  /*
  Runs when the restart button is clicked, resets the state wth the new cards
  */
  function onRestart() {
    setGame({
      cards: helpers.generateCards(),
      firstCard: undefined,
    });
    setStartTime(0);
    setElapsedTime(0);
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
    setWin(false);
    setScoreCanBeSaved(false);
  }

  return (
    <div className="game-container">
      <StatusBar
        status1={`Time: ${utils.prettifyTime(elapsedTime)}`}
        onRestart={onRestart}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="memory-grid">
        {game.cards.map((card) => (
          <MemoryCard
            key={card.key}
            color={card.color}
            isFlipped={card.isFlipped}
            onClick={() => onCardClicked(card)}
          />
        ))}
      </div>
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        header={win ? "Congratulations, you won!" : "Leaderboard"}
        body={win ? `Your time was ${utils.prettifyTime(elapsedTime)}.` : ""}
        fetchLeaderboard={helpers.fetchLeaderboard}
        saveScore={(name) =>
          helpers
            .saveScore(name, elapsedTime)
            .then(() => setScoreCanBeSaved(false))
        }
        scoreCanBeSaved={scoreCanBeSaved}
      ></ResultModal>
    </div>
  );
}

export default Memory;
