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
      // Update to row and col
      board[row][col] = userSymbol;
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
  let coord1 = 0;
  let coord2 = 0;
  let symbol = "";
  let moveCoords = { col: coord1, row: coord2 }; // Update to col and row

  const getWins = () => wins;
  const giveWin = () => wins++;
  const setSymbol = (playerSymbol) => {
    symbol = playerSymbol;
  };
  const movePrompt = () => {
    coord1 = parseInt(
      prompt(`Enter your column-coordinate (0-2), ${name}: `),
      10
    ); // Update prompt to column-coordinate
    coord2 = parseInt(prompt(`Enter your row-coordinate (0-2), ${name}: `), 10); // Update prompt to row-coordinate
    moveCoords = { col: coord1, row: coord2 }; // Update to col and row
  };
  const getMoveCoords = () => moveCoords;
  const getSymbol = () => symbol;

  return {
    name,
    getWins,
    giveWin,
    setSymbol,
    movePrompt,
    getMoveCoords,
    getSymbol,
  };
}

// Game Controller
const gameController = (function () {
  let player1, player2;
  let currentPlayer;

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

  function playRound() {
    currentPlayer.movePrompt();
    const move = currentPlayer.getMoveCoords();
    const updated = gameboard.updateBoard(currentPlayer.getSymbol(), move);
    if (updated) {
      gameboard.displayBoard();
      if (gameboard.checkWin(currentPlayer.getSymbol(), move)) {
        console.log(`${currentPlayer.name} wins!`);
        currentPlayer.giveWin();
        return true;
      }
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    return false;
  }

  function startGame() {
    gameboard.resetBoard();
    gameboard.displayBoard();
    initializePlayers();
    let rounds = 0;
    while (rounds < 9) {
      if (playRound()) break;
      rounds++;
    }
    if (rounds === 9) {
      console.log("Game Over! It's a draw.");
    }
  }

  return {
    startGame,
  };
})();

// Start the game
// gameController.startGame();
