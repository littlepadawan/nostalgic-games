import React, { useState, useEffect, useRef } from "react";
import StatusBar from "../StatusBar";
import MemoryCard from "./MemoryCard";
import ResultModal from "../ResultModal";
import * as utils from "../../utils";
import "./index.css";

const colors = [
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
];

function generateCards() {
  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    cards.push({
      key: i * 2,
      color: colors[i],
      isFlipped: false,
      isLocked: false,
    });
    cards.push({
      key: i * 2 + 1,
      color: colors[i],
      isFlipped: false,
      isLocked: false,
    });
  }
  return cards.sort(() => Math.random() - 0.5);
}

/* 
Returns a new array of cards where the specified card (cardToFlip)
will have a different value of its isFlipped: true changes to false and false to true.
*/
function flipCard(cards, keysToFlip) {
  return cards.map((card) => {
    return {
      ...card,
      isFlipped: keysToFlip.includes(card.key)
        ? !card.isFlipped
        : card.isFlipped,
    };
  });
}

function Memory() {
  // [<current state>, <function to update stare>] = useState(<initial state>) (Gives initial state of the component)
  // expecting array returned by useState, and you define the first two elements
  const [game, setGame] = useState({
    cards: generateCards(),
    firstCard: undefined,
  });

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    }
  }, [win]);

  const [wrongPair, setWrongPair] = useState(null);

  useEffect(() => {
    if (!wrongPair) return;
    const timeoutId = setTimeout(() => {
      setGame((oldGame) => {
        return {
          ...oldGame,
          cards: flipCard(
            oldGame.cards,
            wrongPair.map((card) => card.key)
          ),
        };
      });
    }, 1000);
    timeoutIds.current = timeoutIds.current.concat(timeoutId);
  }, [wrongPair]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const timeoutIds = useRef([]);

  function onCardClicked(clickedCard) {
    // If the card is already flipped there is nothing we need to do (write an if-statement with a return; inside)
    if (clickedCard.isFlipped) {
      return;
    }

    setGame(({ cards, firstCard }) => {
      const newCards = flipCard(cards, [clickedCard.key]);
      const isCardFlipped = (card) => card.isFlipped;

      // The { cards, firstCard, secondCard } above is the decomposed game object.
      // These three variables represent the previous state, before a card was clicked.
      // We should return the new state, depending on the previous one and on the card that was clicked.
      // There are 4 different cases.
      // 1. If both firstCard and secondCard from the previous state are undefined =>
      // we should flip the clicked card and set it as the firstCard
      if (!firstCard) {
        // same as firstCard === undefined
        return {
          cards: newCards,
          firstCard: clickedCard,
        };
      }
      // 2. Else, if firstCard is defined, but secondCard isn't =>
      // we should flip the clicked card
      else {
        cards.map((card) => {
          card.isLocked = true;
          console.log(card.key + " " + card.isLocked);
        });
        if (firstCard.color !== clickedCard.color) {
          setWrongPair([firstCard, clickedCard]);
        }
        if (newCards.every(isCardFlipped)) {
          setWin(true);
        }
        return {
          cards: newCards,
        };
      }
    });

    if (startTime === 0) setStartTime(Date.now());
  }

  /*
  Runs when the restart button is clicked, resets the state wth the new cards
  */
  function onRestart() {
    setGame({
      cards: generateCards(),
      firstCard: undefined,
    });
    setStartTime(0);
    setElapsedTime(0);
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
    setWin(false);
  }

  return (
    <div className="game-container">
      <StatusBar
        status={"Time: " + elapsedTime}
        onRestart={onRestart}
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
        header={"You won"}
        body={"Your time was " + elapsedTime + " ms"}
      ></ResultModal>
    </div>
  );
}

export default Memory;
