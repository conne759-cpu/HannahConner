// External game script for emoji-based Tic Tac Toe with audio
document.addEventListener('DOMContentLoaded', () => {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;
  let gameAudio = null;

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

  // Initialize audio reference
  function initAudio() {
    try {
      if (window.gameAudio) {
        gameAudio = window.gameAudio;
        console.log('Audio initialized in game');
      } else {
        console.warn('GameAudio not available yet');
      }
    } catch (e) {
      console.warn('Failed to initialize audio:', e);
    }
  }

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
  });

  function makeMove(index) {
    try {
      if (board[index] !== '' || !gameActive || currentPlayer !== 'X') return;

      // Play click sound
      if (gameAudio && gameAudio.playClickSound) {
        gameAudio.playClickSound();
      }

      board[index] = 'X';
      cells[index].textContent = '🐕';
      cells[index].classList.add('x');
      cells[index].disabled = true;

      // Play player move sound
      if (gameAudio && gameAudio.playPlayerMove) {
        gameAudio.playPlayerMove();
      }

      if (checkWinner()) {
        gameActive = false;
        showWinner('X');
        // Play win sound for player
        if (gameAudio && gameAudio.playWinSound) {
          gameAudio.playWinSound(true);
        }
        return;
      }

      if (checkTie()) {
        gameActive = false;
        showWinner('tie');
        // Play tie sound
        if (gameAudio && gameAudio.playTieSound) {
          gameAudio.playTieSound();
        }
        return;
      }

      currentPlayer = 'O';
      setTimeout(makeComputerMove, 500);
    } catch (e) {
      console.warn('Error in makeMove:', e);
    }
  }

  function makeComputerMove() {
    try {
      if (!gameActive) return;

      let move = findWinningMove('O') ||
                 findWinningMove('X') ||
                 (board[4] === '' ? 4 : null) ||
                 findCornerMove() ||
                 findEdgeMove();

      if (move !== null) {
        // Play computer move sound
        if (gameAudio && gameAudio.playComputerMove) {
          gameAudio.playComputerMove();
        }

        board[move] = 'O';
        cells[move].textContent = '🏫';
        cells[move].classList.add('o');
        cells[move].disabled = true;

        if (checkWinner()) {
          gameActive = false;
          showWinner('O');
          // Play win sound for computer
          if (gameAudio && gameAudio.playWinSound) {
            gameAudio.playWinSound(false);
          }
          return;
        }

        if (checkTie()) {
          gameActive = false;
          showWinner('tie');
          // Play tie sound
          if (gameAudio && gameAudio.playTieSound) {
            gameAudio.playTieSound();
          }
          return;
        }

        currentPlayer = 'X';
      }
    } catch (e) {
      console.warn('Error in makeComputerMove:', e);
    }
  }

  function findWinningMove(player) {
    try {
      for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
      }
      return null;
    } catch (e) {
      console.warn('Error in findWinningMove:', e);
      return null;
    }
  }

  function findCornerMove() {
    try {
      const corners = [0, 2, 6, 8];
      for (let corner of corners) if (board[corner] === '') return corner;
      return null;
    } catch (e) {
      console.warn('Error in findCornerMove:', e);
      return null;
    }
  }

  function findEdgeMove() {
    try {
      const edges = [1, 3, 5, 7];
      for (let edge of edges) if (board[edge] === '') return edge;
      return null;
    } catch (e) {
      console.warn('Error in findEdgeMove:', e);
      return null;
    }
  }

  function checkWinner() {
    try {
      for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return true;
      }
      return false;
    } catch (e) {
      console.warn('Error in checkWinner:', e);
      return false;
    }
  }

  function checkTie() {
    try {
      return board.every(cell => cell !== '');
    } catch (e) {
      console.warn('Error in checkTie:', e);
      return false;
    }
  }

  function showWinner(winner) {
    try {
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
    } catch (e) {
      console.warn('Error in showWinner:', e);
    }
  }

  function resetGame() {
    try {
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
      
      // Play game start sound on reset
      if (gameAudio && gameAudio.playGameStart) {
        gameAudio.playGameStart();
      }
    } catch (e) {
      console.warn('Error in resetGame:', e);
    }
  }

  // Initialize audio after a short delay to ensure GameAudio is loaded
  setTimeout(initAudio, 200);

  // Expose reset for inline button handlers if present
  window.resetGame = resetGame;
});
