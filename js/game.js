// Enhanced Tic Tac Toe Game with Levels, Points, and Advanced AI
document.addEventListener('DOMContentLoaded', () => {
  // Game State
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;
  let gameAudio = null;
  let moveCount = 0;
  
  // Scoring and Levels
  let totalScore = 0;
  let currentLevel = 1;
  let gamesPlayed = 0;
  let gamesWon = 0;
  let gamesLost = 0;
  let gamesTied = 0;
  
  // Points configuration
  const POINTS = {
    WIN: 100,
    TIE: 50,
    LOSS: -30,
    MOVE: 5,
    PERFECT_WIN: 150 // Win with no opponent moves
  };
  
  // Level configuration
  const LEVELS = [
    { level: 1, name: 'Beginner', color: '#4CAF50', pointsNeeded: 0, aiStrength: 0.3 },
    { level: 2, name: 'Easy', color: '#8BC34A', pointsNeeded: 200, aiStrength: 0.5 },
    { level: 3, name: 'Medium', color: '#FFC107', pointsNeeded: 500, aiStrength: 0.7 },
    { level: 4, name: 'Hard', color: '#FF9800', pointsNeeded: 1000, aiStrength: 0.85 },
    { level: 5, name: 'Expert', color: '#FF5722', pointsNeeded: 2000, aiStrength: 0.95 },
    { level: 6, name: 'Master', color: '#9C27B0', pointsNeeded: 3500, aiStrength: 1.0 }
  ];

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
  ];

  const cells = document.querySelectorAll('.cell');
  const winnerMessage = document.getElementById('winnerMessage');
  
  // Initialize
  loadGameProgress();
  updateUI();
  initAudio();
  
  // Initialize audio reference
  function initAudio() {
    try {
      if (window.gameAudio) {
        gameAudio = window.gameAudio;
        console.log('Audio initialized in game');
      } else {
        setTimeout(initAudio, 200);
      }
    } catch (e) {
      console.warn('Failed to initialize audio:', e);
    }
  }
  
  // Load saved progress
  function loadGameProgress() {
    try {
      const saved = localStorage.getItem('tictactoe_progress');
      if (saved) {
        const data = JSON.parse(saved);
        totalScore = data.totalScore || 0;
        currentLevel = data.currentLevel || 1;
        gamesPlayed = data.gamesPlayed || 0;
        gamesWon = data.gamesWon || 0;
        gamesLost = data.gamesLost || 0;
        gamesTied = data.gamesTied || 0;
      }
    } catch (e) {
      console.warn('Failed to load progress:', e);
    }
  }
  
  // Save progress
  function saveGameProgress() {
    try {
      const data = {
        totalScore,
        currentLevel,
        gamesPlayed,
        gamesWon,
        gamesLost,
        gamesTied
      };
      localStorage.setItem('tictactoe_progress', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }
  
  // Update UI elements
  function updateUI() {
    updateScore();
    updateLevel();
    updateStats();
  }
  
  function updateScore() {
    let scoreEl = document.getElementById('currentScore');
    if (!scoreEl) {
      const gameInfo = document.querySelector('.game-info');
      if (gameInfo) {
        gameInfo.insertAdjacentHTML('afterend', `
          <div class="score-display">
            <div class="score-item">
              <span class="score-label">Score:</span>
              <span id="currentScore" class="score-value">${totalScore}</span>
            </div>
          </div>
        `);
      }
    } else {
      scoreEl.textContent = totalScore;
    }
  }
  
  function updateLevel() {
    const levelConfig = getCurrentLevelConfig();
    let levelEl = document.getElementById('currentLevel');
    
    if (!levelEl) {
      const scoreDisplay = document.querySelector('.score-display');
      if (scoreDisplay) {
        scoreDisplay.insertAdjacentHTML('beforeend', `
          <div class="score-item">
            <span class="score-label">Level:</span>
            <span id="currentLevel" class="level-value">${currentLevel} - ${levelConfig.name}</span>
          </div>
        `);
      }
    } else {
      levelEl.textContent = `${currentLevel} - ${levelConfig.name}`;
      levelEl.style.color = levelConfig.color;
    }
    
    // Update progress bar
    updateLevelProgress();
  }
  
  function updateLevelProgress() {
    let progressBar = document.getElementById('levelProgress');
    if (!progressBar) {
      const scoreDisplay = document.querySelector('.score-display');
      if (scoreDisplay) {
        scoreDisplay.insertAdjacentHTML('afterend', `
          <div class="level-progress-container">
            <div class="level-progress-bar">
              <div id="levelProgress" class="level-progress-fill"></div>
            </div>
            <div id="levelProgressText" class="level-progress-text"></div>
          </div>
        `);
        progressBar = document.getElementById('levelProgress');
      }
    }
    
    if (progressBar) {
      const currentLevelConfig = getCurrentLevelConfig();
      const nextLevelConfig = LEVELS[currentLevel]; // Next level
      
      if (nextLevelConfig) {
        const pointsInCurrentLevel = totalScore - currentLevelConfig.pointsNeeded;
        const pointsNeededForNext = nextLevelConfig.pointsNeeded - currentLevelConfig.pointsNeeded;
        const progress = Math.min(100, (pointsInCurrentLevel / pointsNeededForNext) * 100);
        
        progressBar.style.width = progress + '%';
        progressBar.style.backgroundColor = currentLevelConfig.color;
        
        const progressText = document.getElementById('levelProgressText');
        if (progressText) {
          progressText.textContent = `${pointsInCurrentLevel}/${pointsNeededForNext} points to Level ${nextLevelConfig.level}`;
        }
      } else {
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = currentLevelConfig.color;
        const progressText = document.getElementById('levelProgressText');
        if (progressText) {
          progressText.textContent = 'MAX LEVEL! 🏆';
        }
      }
    }
  }
  
  function updateStats() {
    let statsEl = document.getElementById('gameStats');
    if (!statsEl) {
      const progressContainer = document.querySelector('.level-progress-container');
      if (progressContainer) {
        progressContainer.insertAdjacentHTML('afterend', `
          <div id="gameStats" class="game-stats">
            <div class="stat-item">Played: <strong>${gamesPlayed}</strong></div>
            <div class="stat-item">Won: <strong class="stat-win">${gamesWon}</strong></div>
            <div class="stat-item">Lost: <strong class="stat-loss">${gamesLost}</strong></div>
            <div class="stat-item">Tied: <strong class="stat-tie">${gamesTied}</strong></div>
          </div>
        `);
      }
    } else {
      statsEl.innerHTML = `
        <div class="stat-item">Played: <strong>${gamesPlayed}</strong></div>
        <div class="stat-item">Won: <strong class="stat-win">${gamesWon}</strong></div>
        <div class="stat-item">Lost: <strong class="stat-loss">${gamesLost}</strong></div>
        <div class="stat-item">Tied: <strong class="stat-tie">${gamesTied}</strong></div>
      `;
    }
  }
  
  function getCurrentLevelConfig() {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalScore >= LEVELS[i].pointsNeeded) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }
  
  function checkLevelUp() {
    const newLevelConfig = getCurrentLevelConfig();
    if (newLevelConfig.level > currentLevel) {
      currentLevel = newLevelConfig.level;
      showLevelUpMessage(newLevelConfig);
      if (gameAudio && gameAudio.playSound) {
        gameAudio.playSound('win');
      }
      return true;
    }
    return false;
  }
  
  function showLevelUpMessage(levelConfig) {
    const message = document.createElement('div');
    message.className = 'level-up-message';
    message.innerHTML = `
      <div class="level-up-content">
        <h2>🎉 LEVEL UP! 🎉</h2>
        <p>Level ${levelConfig.level}: ${levelConfig.name}</p>
        <p class="level-up-subtitle">AI difficulty increased!</p>
      </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 500);
    }, 3000);
  }
  
  function addPoints(points, reason) {
    totalScore = Math.max(0, totalScore + points);
    showPointsAnimation(points, reason);
    saveGameProgress();
    updateUI();
    checkLevelUp();
  }
  
  function showPointsAnimation(points, reason) {
    const animation = document.createElement('div');
    animation.className = 'points-animation';
    animation.textContent = `${points > 0 ? '+' : ''}${points} - ${reason}`;
    animation.style.color = points > 0 ? '#4CAF50' : '#f44336';
    
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
      gameBoard.appendChild(animation);
      setTimeout(() => animation.classList.add('show'), 10);
      setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => animation.remove(), 300);
      }, 2000);
    }
  }

  // Game logic
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
  });

  function makeMove(index) {
    try {
      if (board[index] !== '' || !gameActive || currentPlayer !== 'X') return;

      if (gameAudio && gameAudio.playClickSound) {
        gameAudio.playClickSound();
      }

      board[index] = 'X';
      cells[index].textContent = '🐕';
      cells[index].classList.add('x', 'pulse');
      cells[index].disabled = true;
      moveCount++;

      if (gameAudio && gameAudio.playPlayerMove) {
        gameAudio.playPlayerMove();
      }
      
      // Award points for move
      addPoints(POINTS.MOVE, 'Move');

      if (checkWinner()) {
        gameActive = false;
        const perfectWin = board.filter(cell => cell === 'O').length === 0;
        const points = perfectWin ? POINTS.PERFECT_WIN : POINTS.WIN;
        showWinner('X');
        gamesWon++;
        gamesPlayed++;
        addPoints(points, perfectWin ? 'Perfect Win!' : 'Win!');
        
        if (gameAudio && gameAudio.playWinSound) {
          gameAudio.playWinSound(true);
        }
        return;
      }

      if (checkTie()) {
        gameActive = false;
        showWinner('tie');
        gamesTied++;
        gamesPlayed++;
        addPoints(POINTS.TIE, 'Tie');
        
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

      const levelConfig = getCurrentLevelConfig();
      let move = null;
      
      // AI makes smarter moves based on level
      if (Math.random() < levelConfig.aiStrength) {
        // Smart move
        move = findWinningMove('O') ||
               findWinningMove('X') ||
               (board[4] === '' ? 4 : null) ||
               findCornerMove() ||
               findEdgeMove();
      } else {
        // Random move (for lower levels)
        move = findRandomMove();
      }

      if (move !== null) {
        if (gameAudio && gameAudio.playComputerMove) {
          gameAudio.playComputerMove();
        }

        board[move] = 'O';
        cells[move].textContent = '🏫';
        cells[move].classList.add('o', 'pulse');
        cells[move].disabled = true;

        if (checkWinner()) {
          gameActive = false;
          showWinner('O');
          gamesLost++;
          gamesPlayed++;
          addPoints(POINTS.LOSS, 'Loss');
          
          if (gameAudio && gameAudio.playWinSound) {
            gameAudio.playWinSound(false);
          }
          return;
        }

        if (checkTie()) {
          gameActive = false;
          showWinner('tie');
          gamesTied++;
          gamesPlayed++;
          addPoints(POINTS.TIE, 'Tie');
          
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
  
  function findRandomMove() {
    const availableMoves = [];
    board.forEach((cell, index) => {
      if (cell === '') availableMoves.push(index);
    });
    return availableMoves.length > 0 
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
      : null;
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
      return null;
    }
  }

  function findEdgeMove() {
    try {
      const edges = [1, 3, 5, 7];
      for (let edge of edges) if (board[edge] === '') return edge;
      return null;
    } catch (e) {
      return null;
    }
  }

  function checkWinner() {
    try {
      for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          // Highlight winning combination
          cells[a].classList.add('winner');
          cells[b].classList.add('winner');
          cells[c].classList.add('winner');
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function checkTie() {
    return board.every(cell => cell !== '');
  }

  function showWinner(winner) {
    try {
      if (!winnerMessage) return;
      if (winner === 'X') {
        winnerMessage.innerHTML = '🎉 Bulldogs Win! 🎉<br><span class="winner-points">+' + 
          (board.filter(cell => cell === 'O').length === 0 ? POINTS.PERFECT_WIN : POINTS.WIN) + 
          ' points</span>';
        winnerMessage.className = 'winner-message winner-x';
      } else if (winner === 'O') {
        winnerMessage.innerHTML = '🏆 UMN Wins! 🏆<br><span class="winner-points">' + 
          POINTS.LOSS + ' points</span>';
        winnerMessage.className = 'winner-message winner-o';
      } else {
        winnerMessage.innerHTML = '🤝 It\'s a Tie! 🤝<br><span class="winner-points">+' + 
          POINTS.TIE + ' points</span>';
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
      moveCount = 0;
      
      cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
        cell.classList.remove('x', 'o', 'pulse', 'winner');
      });
      
      if (winnerMessage) {
        winnerMessage.textContent = '';
        winnerMessage.className = '';
      }
      
      if (gameAudio && gameAudio.playGameStart) {
        gameAudio.playGameStart();
      }
    } catch (e) {
      console.warn('Error in resetGame:', e);
    }
  }
  
  function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      totalScore = 0;
      currentLevel = 1;
      gamesPlayed = 0;
      gamesWon = 0;
      gamesLost = 0;
      gamesTied = 0;
      saveGameProgress();
      updateUI();
      resetGame();
    }
  }

  // Expose functions globally
  window.resetGame = resetGame;
  window.resetProgress = resetProgress;
});
