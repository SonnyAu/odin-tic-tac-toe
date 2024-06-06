const gameboard = (function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function displayBoard() {
    console.log(board.map((row) => row.join(" | ")).join("\n---------\n"));
  }

  function updateBoard(user, userMove) {
    const { row, col } = userMove;
    if (board[row][col] === "") {
      board[row][col] = user;
      return true;
    } else {
      console.log("Cell already occupied! Choose a different move.");
      return false;
    }
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
  };
})();

function player(name) {
  let wins = 0;
  let coord1 = 0;
  let coord2 = 0;
  let moveCoords = [coord1, coord2];

  const getWins = () => wins;
  const giveWin = () => wins++;
  const movePrompt = () => {
    coord1 = parseInt(prompt(`Enter your x-coordinate (0-2), ${name}: `), 10);
    coord2 = parseInt(prompt(`Enter your y-coordinate (0-2), ${name}: `), 10);
    moveCoords = { row: coord1, col: coord2 };
  };
  const getMoveCoords = () => moveCoords;

  return {
    name,
    getWins,
    giveWin,
    movePrompt,
    getMoveCoords,
  };
}

// Game Controller
const gameController = (function () {
  const player1 = player("Player 1");
  const player2 = player("Player 2");
  let currentPlayer = player1;

  function playRound() {
    currentPlayer.movePrompt();
    const move = currentPlayer.getMoveCoords();
    const updated = gameboard.updateBoard(currentPlayer.name, move);
    if (updated) {
      gameboard.displayBoard();
      // Check for a win condition here if needed
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  }

  function startGame() {
    gameboard.resetBoard();
    gameboard.displayBoard();
    let rounds = 0;
    while (rounds < 9) {
      playRound();
      rounds++;
    }
    console.log("Game Over!");
  }

  return {
    startGame,
  };
})();
