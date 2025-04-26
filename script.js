const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setMark, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.render();
    };

    const playRound = (index) => {
        if (gameOver || !Gameboard.setMark(index, currentPlayer.marker)) return;

        if (checkWinner()) {
            DisplayController.showResult(`${currentPlayer.name} wins!`);
            gameOver = true;
        } else if (isTie()) {
            DisplayController.showResult(`It's a tie!`);
            gameOver = true;
        } else {
            switchPlayer();
        }
        DisplayController.render();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const b = Gameboard.getBoard();
        const winCombos = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];
        return winCombos.some(combo => {
            return combo.every(index => b[index] === currentPlayer.marker);
        });
    };

    const isTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return { startGame, playRound };
})();



const DisplayController = (() => {
    const boardContainer = document.querySelector(".board");
    const resultDisplay = document.querySelector(".result");

    const render = () => {
        boardContainer.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;
            cell.addEventListener("click", () => {
                GameController.playRound(index);
            });
            boardContainer.appendChild(cell);
        });
    };

    const showResult = (message) => {
        resultDisplay.textContent = message;
    };

    return { render, showResult };
})();

document.getElementById("startBtn").addEventListener("click", () => {
    const name1 = document.getElementById("player1").value || "Player 1";
    const name2 = document.getElementById("player2").value || "Player 2";
    GameController.startGame(name1, name2);
});
