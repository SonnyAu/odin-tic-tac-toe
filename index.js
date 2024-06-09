class Gameboard {
  constructor() {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }

  displayBoard() {
    console.log(this.board.map((row) => row.join(" | ")).join("\n---------\n"));
  }

  updateBoard(userSymbol, userMove) {
    const { col, row } = userMove;
    if (this.board[row][col] === "") {
      this.board[row][col] = userSymbol;
      let cell = document.querySelector(`.cell-${row}-${col}`);
      cell.textContent = userSymbol;
      return true;
    } else {
      console.log("Cell already occupied! Choose a different move.");
      return false;
    }
  }

  checkWin(userSymbol, { row, col }) {
    // Check row
    if (this.board[row].every((cell) => cell === userSymbol)) return true;

    // Check column
    if (this.board.every((r) => r[col] === userSymbol)) return true;

    // Check diagonal (top-left to bottom-right)
    if (
      row === col &&
      this.board.every((_, i) => this.board[i][i] === userSymbol)
    )
      return true;

    // Check diagonal (top-right to bottom-left)
    if (
      row + col === 2 &&
      this.board.every((_, i) => this.board[i][2 - i] === userSymbol)
    )
      return true;

    return false;
  }

  resetBoard() {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    document.querySelectorAll(".game-cell").forEach((cell) => {
      cell.textContent = "";
    });
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.wins = 0;
    this.symbol = "";
  }

  getWins() {
    return this.wins;
  }

  giveWin() {
    this.wins++;
  }

  setSymbol(playerSymbol) {
    this.symbol = playerSymbol;
  }

  getSymbol() {
    return this.symbol;
  }
}

class GameController {
  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.currentPlayer = null;
    this.rounds = 0;
    this.gameboard = new Gameboard();
  }

  initializePlayers() {
    const name1 = prompt("Enter the name of Player 1: ");
    this.player1 = new Player(name1);
    const symbol1 = prompt(`${name1}, type a letter to represent you: `);
    this.player1.setSymbol(symbol1);

    const name2 = prompt("Enter the name of Player 2: ");
    this.player2 = new Player(name2);
    const symbol2 = prompt(`${name2}, type a letter to represent you: `);
    this.player2.setSymbol(symbol2);

    this.currentPlayer = this.player1;
  }

  handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));
    const move = { row, col };

    const updated = this.gameboard.updateBoard(
      this.currentPlayer.getSymbol(),
      move
    );
    if (updated) {
      this.gameboard.displayBoard();
      if (this.gameboard.checkWin(this.currentPlayer.getSymbol(), move)) {
        setTimeout(() => {
          alert(`${this.currentPlayer.name} wins!`);
          console.log(`${this.currentPlayer.name} wins!`);
        }, 0);
        this.currentPlayer.giveWin();
        document.querySelectorAll(".game-cell").forEach((cell) => {
          cell.removeEventListener("click", this.handleCellClick.bind(this));
        });
        return;
      }
      this.currentPlayer =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
      this.rounds++;
      if (this.rounds === 9) {
        setTimeout(() => {
          alert("Game Over! It's a draw.");
          console.log("Game Over! It's a draw.");
        }, 0);
        document.querySelectorAll(".game-cell").forEach((cell) => {
          cell.removeEventListener("click", this.handleCellClick.bind(this));
        });
      }
    }
  }

  startGame() {
    this.gameboard.resetBoard();
    this.gameboard.displayBoard();
    this.initializePlayers();
    this.rounds = 0;
    document.querySelectorAll(".game-cell").forEach((cell) => {
      cell.addEventListener("click", this.handleCellClick.bind(this));
    });
  }

  restartGame() {
    this.startGame();
  }
}

// Start the game
document.addEventListener("DOMContentLoaded", () => {
  const gameController = new GameController();
  gameController.startGame();
  document
    .getElementById("restart-button")
    .addEventListener("click", gameController.restartGame.bind(gameController));
});
