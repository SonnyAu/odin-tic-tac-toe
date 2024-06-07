const gameboard = (function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function displayBoard() {
    console.log(board.map((row) => row.join(" | ")).join("\n---------\n"));
  }

  function updateBoard(userSymbol, userMove) {
    const { col, row } = userMove;
    if (board[row][col] === "") {
      board[row][col] = userSymbol;
      let cell = document.querySelector(`.cell-${row}-${col}`);
      cell.textContent = userSymbol;
      return true;
    } else {
      console.log("Cell already occupied! Choose a different move.");
      return false;
    }
  }

  function checkWin(userSymbol, { row, col }) {
    // Check row
    if (board[row].every((cell) => cell === userSymbol)) return true;

    // Check column
    if (board.every((r) => r[col] === userSymbol)) return true;

    // Check diagonal (top-left to bottom-right)
    if (row === col && board.every((_, i) => board[i][i] === userSymbol))
      return true;

    // Check diagonal (top-right to bottom-left)
    if (
      row + col === 2 &&
      board.every((_, i) => board[i][2 - i] === userSymbol)
    )
      return true;

    return false;
  }

  function getBoard() {
    return board;
  }

  function resetBoard() {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    document.querySelectorAll(".game-cell").forEach((cell) => {
      cell.textContent = "";
    });
  }

  return {
    updateBoard,
    displayBoard,
    getBoard,
    resetBoard,
    checkWin,
  };
})();

function player(name) {
  let wins = 0;
  let symbol = "";

  const getWins = () => wins;
  const giveWin = () => wins++;
  const setSymbol = (playerSymbol) => {
    symbol = playerSymbol;
  };
  const getSymbol = () => symbol;

  return {
    name,
    getWins,
    giveWin,
    setSymbol,
    getSymbol,
  };
}

// Game Controller
const gameController = (function () {
  let player1, player2;
  let currentPlayer;
  let rounds = 0;

  function initializePlayers() {
    const name1 = prompt("Enter the name of Player 1: ");
    player1 = player(name1);
    const symbol1 = prompt(`${name1}, type a letter to represent you: `);
    player1.setSymbol(symbol1);

    const name2 = prompt("Enter the name of Player 2: ");
    player2 = player(name2);
    const symbol2 = prompt(`${name2}, type a letter to represent you: `);
    player2.setSymbol(symbol2);

    currentPlayer = player1;
  }

  function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));
    const move = { row, col };

    const updated = gameboard.updateBoard(currentPlayer.getSymbol(), move);
    if (updated) {
      gameboard.displayBoard();
      if (gameboard.checkWin(currentPlayer.getSymbol(), move)) {
        setTimeout(() => {
          alert(`${currentPlayer.name} wins!`);
          console.log(`${currentPlayer.name} wins!`);
        }, 0);
        currentPlayer.giveWin();
        document.querySelectorAll(".game-cell").forEach((cell) => {
          cell.removeEventListener("click", handleCellClick);
        });
        return;
      }
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      rounds++;
      if (rounds === 9) {
        setTimeout(() => {
          alert("Game Over! It's a draw.");
          console.log("Game Over! It's a draw.");
        }, 0);
        document.querySelectorAll(".game-cell").forEach((cell) => {
          cell.removeEventListener("click", handleCellClick);
        });
      }
    }
  }

  function startGame() {
    gameboard.resetBoard();
    gameboard.displayBoard();
    initializePlayers();
    rounds = 0;
    document.querySelectorAll(".game-cell").forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });
  }

  function restartGame() {
    startGame();
  }

  return {
    startGame,
    restartGame,
  };
})();

// Start the game
document.addEventListener("DOMContentLoaded", () => {
  gameController.startGame();
  document
    .getElementById("restart-button")
    .addEventListener("click", gameController.restartGame);
});
