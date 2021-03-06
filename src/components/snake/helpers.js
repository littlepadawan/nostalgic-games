import * as utils from "../../utils";

export const width = 20;
export const height = 12;

// Generates initial snake with initial direction, a food and an empty array to be filled with commands
export function generateGame() {
  const snake = {
    head: {
      x: width / 2,
      y: height / 2,
    },
    tail: [
      {
        x: width / 2 - 1,
        y: height / 2,
      },
    ],
    dir: "right",
  };
  return {
    snake: snake,
    food: generateFood(snake),
    commands: [],
  };
}

// Generates food. Checks if the generated food is at the same position as snakes head or tail, if so it generates a new position for food
export function generateFood(snake) {
  // let x = snake.head.x;
  // let y = snake.head.y;
  let food = { ...snake.head };
  while (
    isEqual(food, snake.head) ||
    snake.tail.some((cell) => isEqual(food, cell))
  ) {
    food = {
      x: random(width),
      y: random(height),
    };
  }
  return food;
}

// Checks if two positions are the same and returns boolean value
export function isEqual(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function random(max) {
  return Math.floor(Math.random() * max);
}

// Generete new game state depending on previous game state
export function tick(game) {
  // You can replace next three lines with const {snake, food, commands } = game;
  const oldSnake = game.snake;
  const oldFood = game.food;
  const commands = game.commands;

  let newCommands = [...commands];

  /* If there is a command and you have pressed opposite direction or the command is the same as current direction,
   * remove the first direction command in newCommands array */
  while (
    newCommands.length > 0 &&
    (isOpposite(newCommands[0], oldSnake.dir) ||
      newCommands[0] === oldSnake.dir)
  ) {
    newCommands = newCommands.slice(1);
  }

  let newDir = oldSnake.dir;
  if (newCommands.length > 0) {
    newDir = newCommands[0];
    newCommands = newCommands.slice(1);
  }

  // New cell, in newDirection
  let newHead;
  switch (newDir) {
    case "right":
      newHead = { x: oldSnake.head.x + 1, y: oldSnake.head.y };
      break;
    case "down":
      newHead = { x: oldSnake.head.x, y: oldSnake.head.y + 1 };
      break;
    case "left":
      newHead = { x: oldSnake.head.x - 1, y: oldSnake.head.y };
      break;
    case "up":
      newHead = { x: oldSnake.head.x, y: oldSnake.head.y - 1 };
      break;
  }

  // First cell in new tail is the old head cell. You also want to remove last tail cell, if you havent eaten food
  const newTail = generateNewTail(oldSnake, oldFood, newHead);
  const newSnake = {
    ...oldSnake,
    head: newHead,
    tail: newTail,
    dir: newDir,
  };

  // Wait a minute... if newHead has eaten the food, we should generate new food!
  // In that case, change newFood, use generateFood function.

  let newFood = oldFood;
  if (isEqual(newHead, newFood)) {
    newFood = generateFood(newSnake);
  }

  return { snake: newSnake, food: newFood, commands: newCommands };
}

// function generateNewHead(oldSnake) {
//   let newHead;
//   switch (oldSnake.dir) {
//     case "right":
//       newHead = { x: oldSnake.head.x + 1, y: oldSnake.head.y };
//       break;
//     case "down":
//       newHead = { x: oldSnake.head.x, y: oldSnake.head.y + 1 };
//       break;
//     case "left":
//       newHead = { x: oldSnake.head.x - 1, y: oldSnake.head.y };
//       break;
//     case "up":
//       newHead = { x: oldSnake.head.x, y: oldSnake.head.y - 1 };
//       break;
//   }
//   return newHead;
// }

function generateNewTail(oldSnake, oldFood, newHead) {
  // Create a variable newTail (an array). Its first cell should be the old snake's head
  // and the rest of the cells should be the old snake's tail. Use concat() function
  // to add (append) a whole array to another array. Or you can use the [...myArray] syntax somehow... :)
  let newTail = [oldSnake.head];
  newTail = newTail.concat(oldSnake.tail);

  // newTail = [oldSnake.head, ...oldSnake.tail]

  // Now the snake's tail has become longer! We should keep it like that if the snake has eaten,
  // otherwise we need to shorten it (remove the last element). Use the pop() function.
  if (!isEqual(newHead, oldFood)) {
    newTail.pop();
  }
  // Don't forget to return newTail!
  return newTail;
}

export function isGameOver(game) {
  const snake = game.snake;
  return (
    isOutOfBounds(snake.head) ||
    snake.tail.some((cell) => isEqual(cell, snake.head))
  );
}

function isOutOfBounds(cell) {
  return cell.x < 0 || cell.x >= width || cell.y < 0 || cell.y >= height;
}

export const getScore = (game) => game.snake.tail.length - 1;

export function fetchLeaderboard() {
  return utils
    .fetchLeaderboard("snake", [
      ["score", "desc"],
      ["timeMs", "asc"],
    ])
    .then((leaderboard) =>
      // turns every score to a string, by usin string templates
      leaderboard.map(
        (score, i) =>
          `${i + 1}. ${score.name}: ${score.score}, ${utils.prettifyTime(
            score.timeMs
          )}`
      )
    );
}

export function saveScore(name, score, timeMs) {
  // below, you could write {name, score, timeMs}
  return utils.saveScore("snake", { name: name, score: score, timeMs: timeMs });
}

function isOpposite(dir1, dir2) {
  return (
    (dir1 === "left" && dir2 === "right") ||
    (dir1 === "right" && dir2 === "left") ||
    (dir1 === "up" && dir2 === "down") ||
    (dir1 === "down" && dir2 === "up")
  );
}

export const initialIntervalMs = 400;
// Increase speed as snake gets larger
// After every third food unit eaten, reduce interval by 10%
export function getIntervalMs(tailLength) {
  return initialIntervalMs * Math.pow(0.8, Math.floor((tailLength - 1) / 3));
}
