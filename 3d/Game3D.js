// 3D Tic Tac Toe Game Engine
// Built with Three.js

class Game3D {
  constructor() {
    // Game state
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.moveCount = 0;
    
    // Scoring and progression
    this.totalScore = parseInt(localStorage.getItem('tictactoe_score')) || 0;
    this.currentLevel = parseInt(localStorage.getItem('tictactoe_level')) || 1;
    this.gamesPlayed = parseInt(localStorage.getItem('tictactoe_played')) || 0;
    this.gamesWon = parseInt(localStorage.getItem('tictactoe_won')) || 0;
    this.gamesLost = parseInt(localStorage.getItem('tictactoe_lost')) || 0;
    
    // Three.js objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = null;
    this.mouse = null;
    
    // Game objects
    this.boardMesh = null;
    this.cells = [];
    this.pieces = [];
    this.hoveredCell = null;
    
    // Lighting
    this.lights = [];
    
    // Audio
    this.audio = null;
    
    // Constants
    this.CELL_SIZE = 1;
    this.CELL_PADDING = 0.1;
    this.BOARD_SIZE = 3;
    
    this.POINTS = {
      WIN: 100,
      TIE: 50,
      LOSS: -30,
      MOVE: 5,
      PERFECT_WIN: 150
    };
    
    this.LEVELS = [
      { level: 1, name: 'Beginner', color: 0x4CAF50, pointsNeeded: 0, aiStrength: 0.3 },
      { level: 2, name: 'Easy', color: 0x8BC34A, pointsNeeded: 200, aiStrength: 0.5 },
      { level: 3, name: 'Medium', color: 0xFFC107, pointsNeeded: 500, aiStrength: 0.7 },
      { level: 4, name: 'Hard', color: 0xFF9800, pointsNeeded: 1000, aiStrength: 0.85 },
      { level: 5, name: 'Expert', color: 0xFF5722, pointsNeeded: 2000, aiStrength: 0.95 },
      { level: 6, name: 'Master', color: 0x9C27B0, pointsNeeded: 3500, aiStrength: 1.0 }
    ];
    
    this.winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]              // Diagonals
    ];
    
    this.init();
  }
  
  async init() {
    try {
      this.showLoadingProgress(10, 'Initializing 3D engine...');
      await this.initThreeJS();
      
      this.showLoadingProgress(30, 'Creating game board...');
      await this.createBoard();
      
      this.showLoadingProgress(50, 'Setting up lighting...');
      await this.setupLighting();
      
      this.showLoadingProgress(70, 'Configuring camera...');
      await this.setupCamera();
      
      this.showLoadingProgress(85, 'Loading audio...');
      await this.initAudio();
      
      this.showLoadingProgress(95, 'Finalizing...');
      await this.setupInteraction();
      
      this.showLoadingProgress(100, 'Ready!');
      
      // Initialize theme system
      if (typeof ThemeSystem !== 'undefined') {
        this.themeSystem = new ThemeSystem(this);
        this.themeSystem.loadSavedTheme();
      }
      
      // Initialize power-up system
      if (typeof PowerUpSystem !== 'undefined') {
        this.powerUpSystem = new PowerUpSystem(this);
      }
      
      // Initialize particle system
      if (typeof ParticleSystem !== 'undefined') {
        this.particleSystem = new ParticleSystem(this.scene);
      }
      
      // Add back to menu button
      if (typeof GameModeSelector !== 'undefined') {
        const selector = new GameModeSelector();
        selector.addBackButton('menu.html');
      }
      
      setTimeout(() => {
        this.hideLoadingScreen();
        this.updateUI();
        this.animate();
      }, 500);
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      alert('Failed to load 3D game. Please refresh the page.');
    }
  }
  
  showLoadingProgress(percent, text) {
    const fill = document.getElementById('loadingBarFill');
    const loadingText = document.getElementById('loadingText');
    if (fill) fill.style.width = percent + '%';
    if (loadingText) loadingText.textContent = text;
  }
  
  hideLoadingScreen() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
      loading.style.opacity = '0';
      loading.style.transition = 'opacity 0.5s ease';
      setTimeout(() => loading.style.display = 'none', 500);
    }
  }
  
  async initThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer
    const canvas = document.getElementById('gameCanvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Raycaster for mouse picking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);
    
    return Promise.resolve();
  }
  
  async createBoard() {
    // Create board base
    const boardGeometry = new THREE.BoxGeometry(
      this.CELL_SIZE * 3 + this.CELL_PADDING * 2,
      0.2,
      this.CELL_SIZE * 3 + this.CELL_PADDING * 2
    );
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.3,
      roughness: 0.7
    });
    this.boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    this.boardMesh.receiveShadow = true;
    this.boardMesh.position.y = -0.15;
    this.scene.add(this.boardMesh);
    
    // Create grid cells
    const cellGeometry = new THREE.BoxGeometry(
      this.CELL_SIZE - this.CELL_PADDING,
      0.1,
      this.CELL_SIZE - this.CELL_PADDING
    );
    
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      
      const cellMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0x0a0a0a
      });
      
      const cell = new THREE.Mesh(cellGeometry, cellMaterial);
      cell.position.x = (col - 1) * this.CELL_SIZE;
      cell.position.z = (row - 1) * this.CELL_SIZE;
      cell.position.y = 0;
      cell.userData = { index: i, type: 'cell', empty: true };
      cell.castShadow = true;
      cell.receiveShadow = true;
      
      this.cells.push(cell);
      this.scene.add(cell);
    }
    
    // Add grid lines
    this.createGridLines();
    
    return Promise.resolve();
  }
  
  createGridLines() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      opacity: 0.3,
      transparent: true
    });
    
    // Vertical lines
    for (let i = 0; i <= 3; i++) {
      const points = [];
      const x = (i - 1.5) * this.CELL_SIZE;
      points.push(new THREE.Vector3(x, 0.1, -1.5 * this.CELL_SIZE));
      points.push(new THREE.Vector3(x, 0.1, 1.5 * this.CELL_SIZE));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }
    
    // Horizontal lines
    for (let i = 0; i <= 3; i++) {
      const points = [];
      const z = (i - 1.5) * this.CELL_SIZE;
      points.push(new THREE.Vector3(-1.5 * this.CELL_SIZE, 0.1, z));
      points.push(new THREE.Vector3(1.5 * this.CELL_SIZE, 0.1, z));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }
  }
  
  async setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
    this.lights.push(ambient);
    
    // Main directional light
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    directional.castShadow = true;
    directional.shadow.camera.left = -5;
    directional.shadow.camera.right = 5;
    directional.shadow.camera.top = 5;
    directional.shadow.camera.bottom = -5;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;
    this.scene.add(directional);
    this.lights.push(directional);
    
    // Accent point lights
    const pointLight1 = new THREE.PointLight(0x00ff88, 0.5, 10);
    pointLight1.position.set(-3, 3, 3);
    this.scene.add(pointLight1);
    this.lights.push(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00d4ff, 0.5, 10);
    pointLight2.position.set(3, 3, -3);
    this.scene.add(pointLight2);
    this.lights.push(pointLight2);
    
    return Promise.resolve();
  }
  
  async setupCamera() {
    // Orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.target.set(0, 0, 0);
    
    return Promise.resolve();
  }
  
  async initAudio() {
    // Wait for audio system to be ready
    if (window.gameAudio) {
      this.audio = window.gameAudio;
    }
    return Promise.resolve();
  }
  
  async setupInteraction() {
    // Mouse move for hover effects
    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    
    // Click for placing pieces
    window.addEventListener('click', (event) => this.onMouseClick(event), false);
    
    return Promise.resolve();
  }
  
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check intersections with cells
    const intersects = this.raycaster.intersectObjects(this.cells);
    
    // Reset previous hover
    if (this.hoveredCell) {
      this.hoveredCell.material.emissive.setHex(0x0a0a0a);
      this.hoveredCell = null;
    }
    
    // Highlight new hover
    if (intersects.length > 0) {
      const cell = intersects[0].object;
      if (cell.userData.empty && this.gameActive && this.currentPlayer === 'X') {
        this.hoveredCell = cell;
        cell.material.emissive.setHex(0x00ff88);
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  }
  
  onMouseClick(event) {
    if (!this.gameActive || this.currentPlayer !== 'X') return;
    
    // Calculate mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check intersections
    const intersects = this.raycaster.intersectObjects(this.cells);
    
    if (intersects.length > 0) {
      const cell = intersects[0].object;
      if (cell.userData.empty) {
        this.makeMove(cell.userData.index);
      }
    }
  }
  
  makeMove(index) {
    if (this.board[index] !== '' || !this.gameActive || this.currentPlayer !== 'X') return;
    
    // Play sound
    if (this.audio) this.audio.playClickSound();
    
    // Update board
    this.board[index] = 'X';
    this.cells[index].userData.empty = false;
    this.moveCount++;
    
    // Create piece
    this.createPiece('X', index);
    
    // Add points
    this.addPoints(this.POINTS.MOVE, 'Move');
    
    // Check win
    if (this.checkWinner('X')) {
      this.endGame('X');
      return;
    }
    
    // Check tie
    if (this.checkTie()) {
      this.endGame('tie');
      return;
    }
    
    // AI turn
    this.currentPlayer = 'O';
    this.updateTurnIndicator();
    setTimeout(() => this.makeAIMove(), 800);
  }
  
  makeAIMove() {
    if (!this.gameActive) return;
    
    const levelConfig = this.getCurrentLevelConfig();
    let move = null;
    
    // AI Power-Up Strategy (for higher levels)
    if (this.powerUpSystem && this.currentLevel >= 3) {
      this.considerAIPowerUps();
    }
    
    // Smart or random move based on difficulty
    if (Math.random() < levelConfig.aiStrength) {
      move = this.findWinningMove('O') ||
             this.findWinningMove('X') ||
             (this.board[4] === '' ? 4 : null) ||
             this.findCornerMove() ||
             this.findEdgeMove();
    } else {
      move = this.findRandomMove();
    }
    
    if (move !== null) {
      // Play sound
      if (this.audio) this.audio.playComputerMove();
      
      // Update board
      this.board[move] = 'O';
      this.cells[move].userData.empty = false;
      
      // Create piece
      this.createPiece('O', move);
      
      // Check win
      if (this.checkWinner('O')) {
        this.endGame('O');
        return;
      }
      
      // Check tie
      if (this.checkTie()) {
        this.endGame('tie');
        return;
      }
      
      // Player turn
      this.currentPlayer = 'X';
      this.updateTurnIndicator();
    }
  }
  
  createPiece(player, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    let piece;
    const position = new THREE.Vector3(
      (col - 1) * this.CELL_SIZE,
      0.5,
      (row - 1) * this.CELL_SIZE
    );
    
    if (player === 'X') {
      // Create X piece (two crossed cylinders)
      const group = new THREE.Group();
      
      const geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x00ff88,
        emissiveIntensity: 0.3
      });
      
      const bar1 = new THREE.Mesh(geometry, material);
      bar1.rotation.z = Math.PI / 4;
      bar1.castShadow = true;
      group.add(bar1);
      
      const bar2 = new THREE.Mesh(geometry, material);
      bar2.rotation.z = -Math.PI / 4;
      bar2.castShadow = true;
      group.add(bar2);
      
      piece = group;
    } else {
      // Create O piece (torus)
      const geometry = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xff4444,
        emissiveIntensity: 0.3
      });
      
      piece = new THREE.Mesh(geometry, material);
      piece.rotation.x = Math.PI / 2;
      piece.castShadow = true;
    }
    
    // Animate piece appearance
    piece.position.copy(position);
    piece.position.y = 3;
    piece.scale.set(0.1, 0.1, 0.1);
    
    this.scene.add(piece);
    this.pieces.push(piece);
    
    // Animate drop
    const targetY = 0.5;
    const dropAnimation = () => {
      piece.position.y += (targetY - piece.position.y) * 0.1;
      piece.scale.x += (1 - piece.scale.x) * 0.1;
      piece.scale.y += (1 - piece.scale.y) * 0.1;
      piece.scale.z += (1 - piece.scale.z) * 0.1;
      
      if (Math.abs(piece.position.y - targetY) > 0.01) {
        requestAnimationFrame(dropAnimation);
      } else {
        piece.position.y = targetY;
        piece.scale.set(1, 1, 1);
      }
    };
    dropAnimation();
  }
  
  // AI Helper Methods
  findWinningMove(player) {
    for (let condition of this.winningConditions) {
      const [a, b, c] = condition;
      if (this.board[a] === player && this.board[b] === player && this.board[c] === '') return c;
      if (this.board[a] === player && this.board[c] === player && this.board[b] === '') return b;
      if (this.board[b] === player && this.board[c] === player && this.board[a] === '') return a;
    }
    return null;
  }
  
  findCornerMove() {
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
      if (this.board[corner] === '') return corner;
    }
    return null;
  }
  
  findEdgeMove() {
    const edges = [1, 3, 5, 7];
    for (let edge of edges) {
      if (this.board[edge] === '') return edge;
    }
    return null;
  }
  
  findRandomMove() {
    const available = [];
    this.board.forEach((cell, index) => {
      if (cell === '') available.push(index);
    });
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
  }
  
  // AI Power-Up Strategy
  considerAIPowerUps() {
    if (!this.powerUpSystem || !this.gameActive) return;
    
    const aiStrength = this.getCurrentLevelConfig().aiStrength;
    
    // Time Freeze: Use when player is about to win (higher levels)
    if (this.currentLevel >= 4 && Math.random() < aiStrength * 0.3) {
      const playerWinningMove = this.findWinningMove('X');
      if (playerWinningMove !== null) {
        // Simulate using time freeze to prevent player win
        console.log('AI considers Time Freeze');
      }
    }
    
    // X-Ray Vision: Use to scout ahead (expert levels)
    if (this.currentLevel >= 5 && Math.random() < aiStrength * 0.2) {
      // AI gets better at predicting player moves
      console.log('AI uses X-Ray Vision strategy');
    }
    
    // Double Move: Use when AI can win with two consecutive moves
    if (this.currentLevel === 6 && Math.random() < 0.15) {
      const aiWinningMove = this.findWinningMove('O');
      if (aiWinningMove !== null) {
        // High probability of winning
        console.log('AI considers Double Move');
      }
    }
    
    // Shield: Use defensively when player has multiple winning threats
    if (this.currentLevel >= 3 && Math.random() < aiStrength * 0.25) {
      let threats = 0;
      this.winningConditions.forEach(condition => {
        const [a, b, c] = condition;
        const xCount = [this.board[a], this.board[b], this.board[c]].filter(cell => cell === 'X').length;
        const emptyCount = [this.board[a], this.board[b], this.board[c]].filter(cell => cell === '').length;
        if (xCount === 2 && emptyCount === 1) threats++;
      });
      
      if (threats >= 2) {
        console.log('AI considers Shield (multiple threats detected)');
      }
    }
    
    // Bomb: Use to clear player's strategic positions (master level)
    if (this.currentLevel === 6 && Math.random() < 0.1) {
      const centerTaken = this.board[4] === 'X';
      const cornersTaken = [0, 2, 6, 8].filter(i => this.board[i] === 'X').length;
      
      if (centerTaken || cornersTaken >= 2) {
        console.log('AI considers Bomb (strategic disruption)');
      }
    }
    
    // Random Power-Up: Use occasionally for unpredictability
    if (Math.random() < 0.05) {
      console.log('AI considers Random Power-Up');
    }
  }
  
  checkWinner(player) {
    for (let condition of this.winningConditions) {
      const [a, b, c] = condition;
      if (this.board[a] === player && this.board[b] === player && this.board[c] === player) {
        // Highlight winning cells
        this.highlightWinningCells([a, b, c]);
        return true;
      }
    }
    return false;
  }
  
  checkTie() {
    return this.board.every(cell => cell !== '');
  }
  
  highlightWinningCells(indices) {
    indices.forEach(index => {
      this.cells[index].material.emissive.setHex(0xFFD700);
      this.cells[index].material.emissiveIntensity = 0.5;
    });
  }
  
  endGame(winner) {
    this.gameActive = false;
    this.gamesPlayed++;
    
    let points = 0;
    let title = '';
    
    if (winner === 'X') {
      const perfectWin = this.board.filter(cell => cell === 'O').length === 0;
      points = perfectWin ? this.POINTS.PERFECT_WIN : this.POINTS.WIN;
      title = perfectWin ? '🎉 PERFECT WIN! 🎉' : '🎉 YOU WIN! 🎉';
      this.gamesWon++;
      if (this.audio) this.audio.playSound('win');
    } else if (winner === 'O') {
      points = this.POINTS.LOSS;
      title = '😔 YOU LOST';
      this.gamesLost++;
      if (this.audio) this.audio.playSound('lose');
    } else {
      points = this.POINTS.TIE;
      title = '🤝 IT\'S A TIE!';
      if (this.audio) this.audio.playSound('move');
    }
    
    this.addPoints(points, winner === 'X' ? 'Victory!' : winner === 'O' ? 'Defeat' : 'Tie');
    this.saveProgress();
    this.showWinnerOverlay(title, points);
  }
  
  showWinnerOverlay(title, points) {
    const overlay = document.getElementById('winnerOverlay');
    const titleEl = document.getElementById('winnerTitle');
    const pointsEl = document.getElementById('winnerPoints');
    
    if (titleEl) titleEl.textContent = title;
    if (pointsEl) pointsEl.textContent = (points > 0 ? '+' : '') + points + ' Points';
    if (overlay) overlay.style.display = 'flex';
  }
  
  addPoints(points, reason) {
    this.totalScore = Math.max(0, this.totalScore + points);
    this.checkLevelUp();
    this.updateUI();
  }
  
  checkLevelUp() {
    const newConfig = this.getCurrentLevelConfig();
    if (newConfig.level > this.currentLevel) {
      this.currentLevel = newConfig.level;
      // Could add level-up animation here
    }
  }
  
  getCurrentLevelConfig() {
    for (let i = this.LEVELS.length - 1; i >= 0; i--) {
      if (this.totalScore >= this.LEVELS[i].pointsNeeded) {
        return this.LEVELS[i];
      }
    }
    return this.LEVELS[0];
  }
  
  updateUI() {
    const scoreEl = document.getElementById('currentScore');
    const levelEl = document.getElementById('currentLevel');
    const progressEl = document.getElementById('levelProgressFill');
    const playedEl = document.getElementById('gamesPlayed');
    const wonEl = document.getElementById('gamesWon');
    const lostEl = document.getElementById('gamesLost');
    
    if (scoreEl) scoreEl.textContent = this.totalScore;
    
    const levelConfig = this.getCurrentLevelConfig();
    if (levelEl) {
      levelEl.textContent = `${levelConfig.level} - ${levelConfig.name}`;
      levelEl.style.color = '#' + levelConfig.color.toString(16).padStart(6, '0');
    }
    
    // Update progress bar
    if (progressEl) {
      const nextLevel = this.LEVELS[levelConfig.level];
      if (nextLevel) {
        const pointsInLevel = this.totalScore - levelConfig.pointsNeeded;
        const pointsNeeded = nextLevel.pointsNeeded - levelConfig.pointsNeeded;
        const progress = Math.min(100, (pointsInLevel / pointsNeeded) * 100);
        progressEl.style.width = progress + '%';
      } else {
        progressEl.style.width = '100%';
      }
    }
    
    if (playedEl) playedEl.textContent = this.gamesPlayed;
    if (wonEl) wonEl.textContent = this.gamesWon;
    if (lostEl) lostEl.textContent = this.gamesLost;
  }
  
  updateTurnIndicator() {
    const indicator = document.getElementById('turnIndicator');
    if (!indicator) return;
    
    if (this.currentPlayer === 'X') {
      indicator.textContent = '🐕 Your Turn';
      indicator.classList.add('your-turn');
    } else {
      indicator.textContent = '🏫 AI Thinking...';
      indicator.classList.remove('your-turn');
    }
  }
  
  saveProgress() {
    localStorage.setItem('tictactoe_score', this.totalScore);
    localStorage.setItem('tictactoe_level', this.currentLevel);
    localStorage.setItem('tictactoe_played', this.gamesPlayed);
    localStorage.setItem('tictactoe_won', this.gamesWon);
    localStorage.setItem('tictactoe_lost', this.gamesLost);
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update controls
    if (this.controls) this.controls.update();
    
    // Rotate pieces slightly for effect
    this.pieces.forEach((piece, index) => {
      piece.rotation.y += 0.01;
    });
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Global reset function
function resetGame3D() {
  const overlay = document.getElementById('winnerOverlay');
  if (overlay) overlay.style.display = 'none';
  
  // Reload the page to reset game
  window.location.reload();
}

// Initialize game when page loads
window.addEventListener('load', () => {
  window.game3D = new Game3D();
});

