// you can also write const [width, height] = [10, 10], and you call width and height by their names, like variables
export const width = 10;
export const height = 10;
export const mines = 15;

export function generateGrid() {
  const grid = [];
  for (let i = 0; i < height * width; i++) {
    grid.push({
      isMine: false,
      isOpen: false,
      isMarked: false,
    });
  }

  for (let i = 0; i < mines; i++) {
    let random = randomNum();
    while (grid[random].isMine) {
      random = randomNum();
    }
    grid[random].isMine = true;
  }

  return grid;
}

const randomNum = () => Math.floor(Math.random() * (width * height));

export function calculateMinesAround(grid, x, y) {
  let numMines = 0;
  numMines += calculateMines(grid, x - 1, y - 1);
  numMines += calculateMines(grid, x, y - 1);
  numMines += calculateMines(grid, x + 1, y - 1);
  numMines += calculateMines(grid, x - 1, y);
  numMines += calculateMines(grid, x + 1, y);
  numMines += calculateMines(grid, x - 1, y + 1);
  numMines += calculateMines(grid, x, y + 1);
  numMines += calculateMines(grid, x + 1, y + 1);
  return numMines;
}

function calculateMines(grid, x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return 0;
  }
  return grid[y * width + x].isMine ? 1 : 0;
}

export function openCell(oldGrid, x, y) {
  const newGrid = [];
  for (let i = 0; i < height * width; i++) {
    newGrid.push({
      ...oldGrid[i],
      isOpen: y * width + x === i ? true : oldGrid[i].isOpen,
      isMarked: y * width + x === i ? false : oldGrid[i].isMarked,
    });
  }
  return newGrid;
}

export function markCell(oldGrid, x, y) {
  if (oldGrid[y * width + x].isOpen) {
    return oldGrid;
  }
  const newGrid = [];
  for (let i = 0; i < height * width; i++) {
    newGrid.push({
      ...oldGrid[i],
      isMarked:
        y * width + x === i ? !oldGrid[i].isMarked : oldGrid[i].isMarked,
    });
  }
  return newGrid;
}

export function openAllMines(oldGrid) {
  const newGrid = [];
  for (let i = 0; i < height * width; i++) {
    newGrid.push({
      ...oldGrid[i],
      isOpen: oldGrid[i].isOpen || oldGrid[i].isMine,
    });
  }
  return newGrid;
}

export function isWin(grid) {
  return grid.every((cell) =>
    cell.isMine ? cell.isMarked && !cell.isOpen : cell.isOpen
  );
}
