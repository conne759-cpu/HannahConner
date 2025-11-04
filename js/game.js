// External game script for emoji-based Tic Tac Toe
document.addEventListener('DOMContentLoaded', () => {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const cells = document.querySelectorAll('.cell');
  const winnerMessage = document.getElementById('winnerMessage');

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
  });

  function makeMove(index) {
    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') return;

    board[index] = 'X';
    cells[index].textContent = '🐕';
    cells[index].classList.add('x');
    cells[index].disabled = true;

    if (checkWinner()) {
      gameActive = false;
      showWinner('X');
      return;
    }

    if (checkTie()) {
      gameActive = false;
      showWinner('tie');
      return;
    }

    currentPlayer = 'O';
    setTimeout(makeComputerMove, 500);
  }

  function makeComputerMove() {
    if (!gameActive) return;

    let move = findWinningMove('O') ||
               findWinningMove('X') ||
               (board[4] === '' ? 4 : null) ||
               findCornerMove() ||
               findEdgeMove();

    if (move !== null) {
      board[move] = 'O';
      cells[move].textContent = '🏫';
      cells[move].classList.add('o');
      cells[move].disabled = true;

      if (checkWinner()) {
        gameActive = false;
        showWinner('O');
        return;
      }

      if (checkTie()) {
        gameActive = false;
        showWinner('tie');
        return;
      }

      currentPlayer = 'X';
    }
  }

  function findWinningMove(player) {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] === player && board[b] === player && board[c] === '') return c;
      if (board[a] === player && board[c] === player && board[b] === '') return b;
      if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return null;
  }

  function findCornerMove() {
    const corners = [0, 2, 6, 8];
    for (let corner of corners) if (board[corner] === '') return corner;
    return null;
  }

  function findEdgeMove() {
    const edges = [1, 3, 5, 7];
    for (let edge of edges) if (board[edge] === '') return edge;
    return null;
  }

  function checkWinner() {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return true;
    }
    return false;
  }

  function checkTie() {
    return board.every(cell => cell !== '');
  }

  function showWinner(winner) {
    if (!winnerMessage) return;
    if (winner === 'X') {
      winnerMessage.textContent = '🎉 Bulldogs Win! 🎉';
      winnerMessage.className = 'winner-message winner-x';
    } else if (winner === 'O') {
      winnerMessage.textContent = '🏆 UMN Wins! 🏆';
      winnerMessage.className = 'winner-message winner-o';
    } else {
      winnerMessage.textContent = '🤝 It\'s a Tie! 🤝';
      winnerMessage.className = 'winner-message tie';
    }
  }

  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
      cell.textContent = '';
      cell.disabled = false;
      cell.classList.remove('x', 'o');
    });
    if (winnerMessage) {
      winnerMessage.textContent = '';
      winnerMessage.className = '';
    }
  }

  // Expose reset for inline button handlers if present
  window.resetGame = resetGame;
});
