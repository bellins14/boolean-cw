/* -----------------------
PREPARATION PHASE
----------------------- */
// Retrieve all the elements of interest from the page
const scoreCounter = document.querySelector(".score-counter");
const grid = document.querySelector(".grid");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainButton = document.querySelector(".play-again");

// I prepare useful information for the game logic
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
const bombsList = [];
let score = 0;

// Generate some random bombs
while (bombsList.length < totalBombs) {
  const number = Math.floor(Math.random() * totalCells) + 1;
  if (!bombsList.includes(number)) bombsList.push(number);
}

// console.log(bombsList);

/* -----------------------
GRID AND GAME LOGIC
----------------------- */
let isCellEven = false;
let isRowEven = false;

for (let i = 1; i <= totalCells; i++) {
  // Create an element and give it the class 'cell'
  const cell = document.createElement("div");
  cell.classList.add("cell");

  // cell.innerText = i;
  isCellEven = i % 2 === 0;

  // If the row and the cell are even and the other odd: 'cell-dark'
  if ((isRowEven && !isCellEven) || (!isRowEven && isCellEven)) {
    cell.classList.add("cell-dark");
  }

  // If I'm at the end of the line...
  if (i % 10 === 0) isRowEven = !isRowEven;

  // Manage cell clicking
  cell.addEventListener("click", function () {
    cellClickedEvent(this, i);
  });
  cell.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
    cellContextMenu(this);
    return false;
  });

  // Add it to the 'grid'
  grid.appendChild(cell);
}

/* -----------------
FUNCTIONS
----------------- */
// Function to be played when a cell is clicked
function cellClickedEvent(clickedCell, cellIndex) {
  // Check if the cell is not clicked
  if (clickedCell.classList.contains("cell-clicked")) return;

  try {
    clickedCell.classList.remove("cell-right-clicked");
  } catch (error) {}

  if (bombsList.includes(cellIndex)) {
    // If is a bomb ...
    clickedCell.classList.add("cell-bomb");
    endGame(false);
  } else {
    // If isn't a bomb ...
    clickedCell.classList.add("cell-clicked");
    showNearBombsNumber(clickedCell, cellIndex); // metti indice e grdi
    //updateScore();
  }
  // console.log(cellIndex);
}

function cellContextMenu(cellRightClicked) {
  if (cellRightClicked.classList.contains("cell-right-clicked"))
    cellRightClicked.classList.remove("cell-right-clicked");
  else if (!cellRightClicked.classList.contains("cell-clicked"))
    cellRightClicked.classList.add("cell-right-clicked");
}

// Function to increase the score
function updateScore() {
  // increase the score
  score++;
  // Put it in the counter
  scoreCounter.innerText = String(score).padStart(5, 0);

  // Check if the user won
  if (score === maxScore) endGame(true);
}

// Function to decree the end of the game
function endGame(isVictory) {
  if (isVictory === true) {
    // Color it green and change the message
    endGameScreen.classList.add("win");
    endGameText.innerHTML = "YOU<br>WIN";
  } else {
    // Reveal all bombs
    revealAllBombs();
  }

  // Show the screen removing the 'hidden' class
  endGameScreen.classList.remove("hidden");
}

// Function to refresh the page
function playAgain() {
  location.reload();
}

// # BONUS
// Function that reveals all bombs
function revealAllBombs() {
  // Recover all cells
  const cells = document.querySelectorAll(".cell");
  for (let i = 1; i <= cells.length; i++) {
    // Check if the cell is a bomb
    if (bombsList.includes(i)) {
      const cellToReveal = cells[i - 1];
      cellToReveal.classList.add("cell-bomb");
    }
  }
}

// Function that shows the number of bombs near the clicked cell
function showNearBombsNumber(clickedCell, clickedCellIndex) {
  const hasLeft = clickedCellIndex % 10 !== 1;
  const hasTop = clickedCellIndex > 10;
  const hasRight = clickedCellIndex % 10 !== 0;
  const hasBottom = clickedCellIndex <= 90;

  const leftIndex = clickedCellIndex - 1;
  const topIndex = clickedCellIndex - 10;
  const rightIndex = clickedCellIndex + 1;
  const bottomIndex = clickedCellIndex + 10;

  const nearCells = [];

  let i = 0;
  // Check if the cells above are bombs
  if (hasTop) {
    // Check the top left corner
    if (hasLeft) {
      if (bombsList.includes(topIndex - 1)) i++;
      else nearCells.push(topIndex - 1);
    }
    // Check the cell above
    if (bombsList.includes(topIndex)) i++;
    if (!bombsList.includes(topIndex)) nearCells.push(topIndex);
    // Check the top right corner
    if (hasRight) {
      if (bombsList.includes(topIndex + 1)) i++;
      else nearCells.push(topIndex + 1);
    }
  }
  // Check if the cell on the left is a bomb
  if (hasLeft) {
    if (bombsList.includes(leftIndex)) i++;
    else nearCells.push(leftIndex);
  }
  // Check if the cell on the right is a bomb
  if (hasRight) {
    if (bombsList.includes(rightIndex)) i++;
    else nearCells.push(rightIndex);
  }
  // Check if the cells below are bombs
  if (hasBottom) {
    // Check the bottom left corner
    if (hasLeft) {
      if (bombsList.includes(bottomIndex - 1)) i++;
      else nearCells.push(bottomIndex - 1);
    }
    // Check the cell below
    if (bombsList.includes(bottomIndex)) i++;
    if (!bombsList.includes(bottomIndex)) nearCells.push(bottomIndex);
    // Check the bottom right corner
    if (hasRight) {
      if (bombsList.includes(bottomIndex + 1)) i++;
      else nearCells.push(bottomIndex + 1);
    }
  }

  updateScore();
  clickedCell.innerText = i;

  // console.log(clickedCellIndex);

  if (i === 0) {
    // console.log(nearCells);
    for (var j in nearCells) {
      const nearCell = grid.childNodes[nearCells[j] - 1];
      // console.log(nearCell);
      if (!nearCell.classList.contains("cell-clicked")) {
        nearCell.classList.add("cell-clicked");
        showNearBombsNumber(nearCell, nearCells[j]);
      }
    }
  }

  /* const indexes = [
    [topIndex - 1, topIndex, topIndex + 1],
    [leftIndex, clickedCellIndex, rightIndex],
    [bottomIndex - 1, bottomIndex, bottomIndex + 1],
  ]; */
  // console.table(indexes);
  // console.log(bombsList);
}

/* ---------------------
EVENTS
--------------------- */
// Manage the click on the replay button
playAgainButton.addEventListener("click", playAgain);

/* ---------------------
DEPRECATED
--------------------- */
// Function that shows the number of bombs adjacent to the clicked cell
/* function showAdjacentBombsNumber(clickedCell, clickedCellIndex) {
    let i = 0;
    // Check if the cell on the left is a bomb
    if (clickedCellIndex % 10 !== 1 && bombsList.includes(clickedCellIndex - 1))
      i++;
    // Check if the cell above is a bomb
    if (clickedCellIndex > 10 && bombsList.includes(clickedCellIndex - 10)) i++;
    // Check if the cell on the right is a bomb
    if (clickedCellIndex % 10 !== 0 && bombsList.includes(clickedCellIndex + 1))
      i++;
    // Check if the cell below is a bomb
    if (clickedCellIndex <= 90 && bombsList.includes(clickedCellIndex + 10)) i++;

    clickedCell.innerText = i;
  } */
