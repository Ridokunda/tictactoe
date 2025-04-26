const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const squares = [];
  
    const render = () => {
      const gameboardDiv = document.getElementById('gameboard');
      gameboardDiv.innerHTML = '';
  
      board.forEach((mark, index) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = index;
        square.textContent = mark;
        gameboardDiv.appendChild(square);
        squares[index] = square;
      });
    };
  
    const reset = () => {
      board = ["", "", "", "", "", "", "", "", ""];
      render();
      DisplayController.setResult(""); // Clear the result text
    };
  
    const updateBoard = (index, mark) => {
      if (board[index] === "") {
        board[index] = mark;
        render();
        return true;
      }
      return false;
    };
  
    const getBoard = () => board;
  
    const highlightSquares = (indexes) => {
      indexes.forEach(index => {
        squares[index].classList.add('highlight');
      });
    };
  
    return { render, reset, updateBoard, getBoard, highlightSquares };
  })();
  
  const Player = (name, mark) => {
    return { name, mark };
  };
  
  const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
  
    const winningCombos = [
      [0,1,2], [3,4,5], [6,7,8], // Rows
      [0,3,6], [1,4,7], [2,5,8], // Columns
      [0,4,8], [2,4,6]           // Diagonals
    ];
  
    const playRound = (index) => {
      if (gameOver) return;
  
      if (Gameboard.updateBoard(index, currentPlayer.mark)) {
        const winnerInfo = checkWinner();
        if (winnerInfo) {
          DisplayController.setResult(`${currentPlayer.name} wins!`);
          Gameboard.highlightSquares(winnerInfo);
          gameOver = true;
        } else if (isTie()) {
          DisplayController.setResult("It's a tie!");
          gameOver = true;
        } else {
          switchPlayer();
        }
      }
    };
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return combo; // return winning squares
        }
      }
      return null;
    };
  
    const isTie = () => {
      return Gameboard.getBoard().every(cell => cell !== "");
    };
  
    const restartGame = () => {
      Gameboard.reset();
      currentPlayer = player1;
      gameOver = false;
    };
  
    return { playRound, restartGame };
  })();
  
  const DisplayController = (() => {
    const setResult = (message) => {
      document.getElementById('resultDisplay').textContent = message;
    };
  
    document.getElementById('gameboard').addEventListener('click', (e) => {
      if (e.target.classList.contains('square')) {
        const index = e.target.dataset.index;
        GameController.playRound(index);
      }
    });
  
    document.getElementById('restartBtn').addEventListener('click', () => {
      GameController.restartGame();
    });
  
    return { setResult };
  })();
  
  Gameboard.render();
  