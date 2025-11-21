// 3D Cube Tic Tac Toe (3x3x3 = 27 cells)
// 49 possible winning lines in 3D space!

class Game3DCube extends Game3D {
  constructor() {
    super();
    
    // Override board for 3D cube (27 cells)
    this.board = new Array(27).fill('');
    this.BOARD_SIZE = 3;
    
    // 49 winning conditions in 3D space
    this.winningConditions = this.generate3DWinningConditions();
  }
  
  generate3DWinningConditions() {
    const conditions = [];
    
    // Helper to get cell index from 3D coordinates
    const getIndex = (x, y, z) => x + y * 3 + z * 9;
    
    // 1. Rows (9 per layer × 3 layers = 27)
    for (let z = 0; z < 3; z++) {
      for (let y = 0; y < 3; y++) {
        conditions.push([
          getIndex(0, y, z),
          getIndex(1, y, z),
          getIndex(2, y, z)
        ]);
      }
    }
    
    // 2. Columns (9 per layer × 3 layers = 27, but already counted above in different orientation)
    for (let z = 0; z < 3; z++) {
      for (let x = 0; x < 3; x++) {
        conditions.push([
          getIndex(x, 0, z),
          getIndex(x, 1, z),
          getIndex(x, 2, z)
        ]);
      }
    }
    
    // 3. Vertical lines (through Z axis) = 9
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        conditions.push([
          getIndex(x, y, 0),
          getIndex(x, y, 1),
          getIndex(x, y, 2)
        ]);
      }
    }
    
    // 4. Diagonals on XY planes (2 per layer × 3 layers = 6)
    for (let z = 0; z < 3; z++) {
      conditions.push([
        getIndex(0, 0, z),
        getIndex(1, 1, z),
        getIndex(2, 2, z)
      ]);
      conditions.push([
        getIndex(2, 0, z),
        getIndex(1, 1, z),
        getIndex(0, 2, z)
      ]);
    }
    
    // 5. Diagonals on XZ planes (2 per row × 3 rows = 6)
    for (let y = 0; y < 3; y++) {
      conditions.push([
        getIndex(0, y, 0),
        getIndex(1, y, 1),
        getIndex(2, y, 2)
      ]);
      conditions.push([
        getIndex(2, y, 0),
        getIndex(1, y, 1),
        getIndex(0, y, 2)
      ]);
    }
    
    // 6. Diagonals on YZ planes (2 per column × 3 columns = 6)
    for (let x = 0; x < 3; x++) {
      conditions.push([
        getIndex(x, 0, 0),
        getIndex(x, 1, 1),
        getIndex(x, 2, 2)
      ]);
      conditions.push([
        getIndex(x, 2, 0),
        getIndex(x, 1, 1),
        getIndex(x, 0, 2)
      ]);
    }
    
    // 7. Space diagonals (4 through the entire cube)
    conditions.push([
      getIndex(0, 0, 0),
      getIndex(1, 1, 1),
      getIndex(2, 2, 2)
    ]);
    conditions.push([
      getIndex(2, 0, 0),
      getIndex(1, 1, 1),
      getIndex(0, 2, 2)
    ]);
    conditions.push([
      getIndex(0, 2, 0),
      getIndex(1, 1, 1),
      getIndex(2, 0, 2)
    ]);
    conditions.push([
      getIndex(2, 2, 0),
      getIndex(1, 1, 1),
      getIndex(0, 0, 2)
    ]);
    
    return conditions;
  }
  
  async createBoard() {
    // Create board base (larger cube container)
    const boardGeometry = new THREE.BoxGeometry(4, 4, 4);
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.7,
      opacity: 0.1,
      transparent: true,
      wireframe: true
    });
    this.boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    this.scene.add(this.boardMesh);
    
    // Create 27 cells in 3D space
    const cellGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    
    for (let i = 0; i < 27; i++) {
      const x = i % 3;
      const y = Math.floor(i / 3) % 3;
      const z = Math.floor(i / 9);
      
      const cellMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0x0a0a0a,
        transparent: true,
        opacity: 0.3
      });
      
      const cell = new THREE.Mesh(cellGeometry, cellMaterial);
      cell.position.x = (x - 1) * 1.2;
      cell.position.y = (y - 1) * 1.2;
      cell.position.z = (z - 1) * 1.2;
      cell.userData = { index: i, type: 'cell', empty: true, coords: {x, y, z} };
      cell.castShadow = true;
      cell.receiveShadow = true;
      
      this.cells.push(cell);
      this.scene.add(cell);
    }
    
    // Add grid lines for 3D cube
    this.create3DGridLines();
    
    return Promise.resolve();
  }
  
  create3DGridLines() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      opacity: 0.2,
      transparent: true
    });
    
    // Draw grid lines for each axis
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const offset = (i - 1.5) * 1.2;
        const offset2 = (j - 1.5) * 1.2;
        
        // X-axis lines
        const points1 = [
          new THREE.Vector3(-1.8, offset, offset2),
          new THREE.Vector3(1.8, offset, offset2)
        ];
        const geo1 = new THREE.BufferGeometry().setFromPoints(points1);
        this.scene.add(new THREE.Line(geo1, lineMaterial));
        
        // Y-axis lines
        const points2 = [
          new THREE.Vector3(offset, -1.8, offset2),
          new THREE.Vector3(offset, 1.8, offset2)
        ];
        const geo2 = new THREE.BufferGeometry().setFromPoints(points2);
        this.scene.add(new THREE.Line(geo2, lineMaterial));
        
        // Z-axis lines
        const points3 = [
          new THREE.Vector3(offset, offset2, -1.8),
          new THREE.Vector3(offset, offset2, 1.8)
        ];
        const geo3 = new THREE.BufferGeometry().setFromPoints(points3);
        this.scene.add(new THREE.Line(geo3, lineMaterial));
      }
    }
  }
  
  async setupCamera() {
    await super.setupCamera();
    // Adjust camera for 3D cube view
    this.camera.position.set(5, 5, 5);
    this.controls.minDistance = 5;
    this.controls.maxDistance = 15;
  }
  
  createPiece(player, index) {
    const cell = this.cells[index];
    const position = cell.position.clone();
    
    let piece;
    
    if (player === 'X') {
      // Smaller X for 3D cube
      const group = new THREE.Group();
      const geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5
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
      // Smaller O for 3D cube
      const geometry = new THREE.TorusGeometry(0.2, 0.04, 16, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xff4444,
        emissiveIntensity: 0.5
      });
      
      piece = new THREE.Mesh(geometry, material);
      piece.rotation.x = Math.PI / 2;
      piece.castShadow = true;
    }
    
    // Animate piece appearance
    piece.position.copy(position);
    piece.scale.set(0.1, 0.1, 0.1);
    
    this.scene.add(piece);
    this.pieces.push(piece);
    
    // Animate scale
    const scaleAnimation = () => {
      piece.scale.x += (1 - piece.scale.x) * 0.1;
      piece.scale.y += (1 - piece.scale.y) * 0.1;
      piece.scale.z += (1 - piece.scale.z) * 0.1;
      
      if (Math.abs(piece.scale.x - 1) > 0.01) {
        requestAnimationFrame(scaleAnimation);
      } else {
        piece.scale.set(1, 1, 1);
        
        // Add sparkle effect when piece lands
        if (this.particleSystem) {
          this.particleSystem.createSparkles(position);
        }
      }
    };
    scaleAnimation();
  }
  
  // Enhanced AI for 3D Cube
  makeAIMove() {
    if (!this.gameActive) return;
    
    const levelConfig = this.getCurrentLevelConfig();
    let move = null;
    
    // AI Power-Up Strategy (for higher levels)
    if (this.powerUpSystem && this.currentLevel >= 3) {
      this.considerAIPowerUps();
    }
    
    // Smart 3D strategy based on difficulty
    if (Math.random() < levelConfig.aiStrength) {
      // Priority: Win > Block > Center (13) > Corners > Edges
      move = this.findWinningMove('O') ||
             this.findWinningMove('X') ||
             (this.board[13] === '' ? 13 : null) || // Center of cube
             this.findStrategic3DMove() ||
             this.findCornerMove() ||
             this.findEdgeMove() ||
             this.findRandomMove();
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
  
  // Find strategic 3D moves
  findStrategic3DMove() {
    // Check for moves that create multiple winning threats
    const available = [];
    this.board.forEach((cell, index) => {
      if (cell === '') {
        // Count potential winning lines through this cell
        let threats = 0;
        for (let condition of this.winningConditions) {
          if (condition.includes(index)) {
            const [a, b, c] = condition;
            const oCount = [this.board[a], this.board[b], this.board[c]].filter(cell => cell === 'O').length;
            const emptyCount = [this.board[a], this.board[b], this.board[c]].filter(cell => cell === '').length;
            if (oCount === 1 && emptyCount === 2) threats++;
          }
        }
        if (threats > 0) {
          available.push({ index, threats });
        }
      }
    });
    
    if (available.length > 0) {
      // Sort by threat count and return best
      available.sort((a, b) => b.threats - a.threats);
      return available[0].index;
    }
    
    return null;
  }
  
  findRandomMove() {
    const available = [];
    this.board.forEach((cell, index) => {
      if (cell === '') available.push(index);
    });
    return available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : null;
  }
  
  findCornerMove() {
    // Corners in 3D cube
    const corners = [0, 2, 6, 8, 18, 20, 24, 26];
    for (let corner of corners) {
      if (this.board[corner] === '') return corner;
    }
    return null;
  }
  
  findEdgeMove() {
    // Edges in 3D cube (not corners, not center)
    const edges = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    for (let edge of edges) {
      if (this.board[edge] === '') return edge;
    }
    return null;
  }
}

