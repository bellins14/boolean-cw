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
    // Check if the cell is not clicked
    if (cell.classList.contains("cell-clicked")) return;

    if (bombsList.includes(i)) {
      // If is a bomb ...
      cell.classList.add("cell-bomb");
      endGame(false);
    } else {
      // If isn't a bomb ...
      cell.classList.add("cell-clicked");
      showAdjacentBombsNumber(cell, i); // metti indice e grdi
      updateScore();
    }
  });

  // Add it to the 'grid'
  grid.appendChild(cell);
}

/* -----------------
FUNCTIONS
----------------- */
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

// Function that shows the number of bombs adjacent to the clicked cell
function showAdjacentBombsNumber(clickedCell, clickedCellIndex) {
  // Check if the cell is on the edge

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
}

/* ---------------------
EVENTS
-----------------------*/

// Manage the click on the replay button
playAgainButton.addEventListener("click", playAgain);
