import * as utils from "../../utils";
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

export function generateCards() {
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
  Returns a new array of cards where the specified card (keysToFlip (ungefär, card to Flip))
  will have a different value of its isFlipped: true changes to false and false to true.
  Loops through all cards and checks for the clicked cards key. When it finds the card that matches
  the clicked cards key, it changes the value of isFlipped
  */
export function flipCards(cards, keysToFlip) {
  return cards.map((card) => {
    return {
      ...card,
      isFlipped: keysToFlip.includes(card.key)
        ? !card.isFlipped
        : card.isFlipped,
    };
  });
}

export function calculateNewGame(
  { cards, firstCard },
  clickedCard,
  onGameWon,
  setWrongPair
) {
  // If the card is already flipped there is nothing we need to do
  if (clickedCard.isFlipped) {
    return { cards, firstCard };
  }

  const newCards = flipCards(cards, [clickedCard.key]);
  const isCardFlipped = (card) => card.isFlipped;

  // The { cards, firstCard } above is the decomposed game object.
  // These two variables represent the previous state, before a card was clicked.
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
      onGameWon();
    }
    return {
      cards: newCards,
    };
  }
}

//  (memory below, is the game id from firebase)
//.then((leaderboard)) is the result of previous call( utils.fetchLeaderboard)
export function fetchLeaderboard() {
  return utils
    .fetchLeaderboard("memory", [["timeMs", "asc"]])
    .then((leaderboard) =>
      // turns every score to a string, by usin string templates
      leaderboard.map(
        (score, i) =>
          ` ${i + 1} ${score.name}: ${utils.prettifyTime(score.timeMs)} `
      )
    );
}

export function saveScore(name, timeMs) {
  // below, you cold write {name, timeMs}
  return utils.saveScore("memory", { name: name, timeMs: timeMs });
}
