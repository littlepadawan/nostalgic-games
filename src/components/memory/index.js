import React, { useState } from "react";
import StatusBar from "./StatusBar";
import MemoryCard from "./MemoryCard";
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
    });
    cards.push({
      key: i * 2 + 1,
      color: colors[i],
      isFlipped: false,
    });
  }
  return cards.sort(() => Math.random() - 0.5);
}

function Memory() {
  const [cards, setCards] = useState(generateCards());

  function onCardClicked(clickedCard) {
    // change state of game
    setCards((oldCards) => {
      return oldCards.map((card) => {
        if (card.key === clickedCard.key) {
          return {
            ...card,
            isFlipped: !card.isFlipped,
          };
        }
        return card;
      });
    });
  }

  function onRestart() {
    setCards(generateCards());
  }

  return (
    <div className="game-container">
      <StatusBar status="Time:" onRestart={onRestart}></StatusBar>
      <div className="memory-grid">
        {cards.map((card) => (
          <MemoryCard
            key={card.key}
            color={card.color}
            isFlipped={card.isFlipped}
            onClick={() => onCardClicked(card)}
          ></MemoryCard>
        ))}
      </div>
    </div>
  );
}

export default Memory;
