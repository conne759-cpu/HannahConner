// Power-Up System for 3D Tic Tac Toe

class PowerUp {
  constructor(type, name, description, cost, cooldown, icon) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.cooldown = cooldown;
    this.cooldownRemaining = 0;
    this.isActive = false;
    this.icon = icon;
    this.owned = 0;
  }
  
  canUse(game) {
    return this.owned > 0 && this.cooldownRemaining === 0 && game.gameActive;
  }
  
  use(game) {
    if (!this.canUse(game)) return false;
    
    this.owned--;
    this.cooldownRemaining = this.cooldown;
    return true;
  }
  
  updateCooldown() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }
  }
}

class PowerUpSystem {
  constructor(game) {
    this.game = game;
    this.powerUps = {};
    this.activePowerUp = null;
    this.initPowerUps();
    this.createPowerUpUI();
  }
  
  initPowerUps() {
    // Define all available power-ups
    this.powerUps = {
      doubleMove: new PowerUp(
        'doubleMove',
        'Double Move',
        'Place 2 pieces in one turn',
        150,
        3,
        '<i class="fas fa-dice"></i>'
      ),
      bomb: new PowerUp(
        'bomb',
        'Bomb',
        'Remove an opponent\'s piece',
        200,
        5,
        '<i class="fas fa-bomb"></i>'
      ),
      freeze: new PowerUp(
        'freeze',
        'Freeze',
        'Skip opponent\'s next turn',
        175,
        4,
        '<i class="fas fa-snowflake"></i>'
      ),
      shield: new PowerUp(
        'shield',
        'Shield',
        'Protect one of your pieces',
        150,
        4,
        '<i class="fas fa-shield-alt"></i>'
      ),
      undo: new PowerUp(
        'undo',
        'Undo',
        'Take back your last move',
        100,
        2,
        '<i class="fas fa-undo"></i>'
      ),
      scan: new PowerUp(
        'scan',
        'Scan',
        'Reveal AI\'s next move',
        125,
        3,
        '<i class="fas fa-eye"></i>'
      )
    };
    
    // Give player starting power-ups
    this.powerUps.doubleMove.owned = 1;
    this.powerUps.undo.owned = 2;
  }
  
  createPowerUpUI() {
    const existing = document.getElementById('powerUpPanel');
    if (existing) existing.remove();
    
    const panel = document.createElement('div');
    panel.id = 'powerUpPanel';
    panel.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      border: 2px solid rgba(0, 255, 136, 0.3);
      z-index: 100;
    `;
    
    Object.keys(this.powerUps).forEach(key => {
      const powerUp = this.powerUps[key];
      const button = this.createPowerUpButton(powerUp);
      panel.appendChild(button);
    });
    
    document.body.appendChild(panel);
  }
  
  createPowerUpButton(powerUp) {
    const button = document.createElement('div');
    button.className = 'power-up-button';
    button.id = `powerup-${powerUp.type}`;
    button.style.cssText = `
      position: relative;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 212, 255, 0.2));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
    `;
    
    const icon = document.createElement('div');
    icon.innerHTML = powerUp.icon;
    icon.style.cssText = `
      font-size: 28px;
      margin-bottom: 2px;
    `;
    
    const count = document.createElement('div');
    count.className = 'powerup-count';
    count.textContent = powerUp.owned;
    count.style.cssText = `
      position: absolute;
      top: -5px;
      right: -5px;
      background: #FFD700;
      color: #000;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    `;
    
    const cooldown = document.createElement('div');
    cooldown.className = 'powerup-cooldown';
    cooldown.style.cssText = `
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 68, 68, 0.9);
      color: white;
      padding: 2px 6px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: bold;
      display: none;
    `;
    
    button.appendChild(icon);
    button.appendChild(count);
    button.appendChild(cooldown);
    
    // Tooltip
    button.title = `${powerUp.name}\n${powerUp.description}\nCost: ${powerUp.cost} points\nCooldown: ${powerUp.cooldown} turns`;
    
    // Click handler
    button.addEventListener('click', () => this.usePowerUp(powerUp.type));
    
    // Hover effects
    button.addEventListener('mouseenter', () => {
      if (powerUp.canUse(this.game)) {
        button.style.transform = 'scale(1.1)';
        button.style.borderColor = '#00ff88';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    return button;
  }
  
  usePowerUp(type) {
    const powerUp = this.powerUps[type];
    
    if (!powerUp.canUse(this.game)) {
      this.showMessage('❌ Cannot use this power-up right now!', '#ff4444');
      return;
    }
    
    // Execute power-up effect
    switch(type) {
      case 'doubleMove':
        this.activateDoubleMove(powerUp);
        break;
      case 'bomb':
        this.activateBomb(powerUp);
        break;
      case 'freeze':
        this.activateFreeze(powerUp);
        break;
      case 'shield':
        this.activateShield(powerUp);
        break;
      case 'undo':
        this.activateUndo(powerUp);
        break;
      case 'scan':
        this.activateScan(powerUp);
        break;
    }
  }
  
  activateDoubleMove(powerUp) {
    if (!powerUp.use(this.game)) return;
    
    this.game.doubleMovesRemaining = 2;
    this.showMessage('⚡ DOUBLE MOVE ACTIVATED!', '#00ff88');
    this.updateUI();
    
    if (this.game.audio) this.game.audio.playSound('move');
  }
  
  activateBomb(powerUp) {
    if (!powerUp.use(this.game)) return;
    
    this.showMessage('💣 Click an opponent\'s piece to destroy it!', '#ff9800');
    this.game.bombMode = true;
    this.updateUI();
    
    if (this.game.audio) this.game.audio.playSound('move');
  }
  
  activateFreeze(powerUp) {
    if (!powerUp.use(this.game)) return;
    
    this.game.opponentFrozen = true;
    this.showMessage('❄️ OPPONENT FROZEN FOR 1 TURN!', '#00d4ff');
    this.updateUI();
    
    if (this.game.audio) this.game.audio.playSound('move');
  }
  
  activateShield(powerUp) {
    if (!powerUp.use(this.game)) return;
    
    this.showMessage('🛡️ Click one of your pieces to shield it!', '#FFD700');
    this.game.shieldMode = true;
    this.updateUI();
    
    if (this.game.audio) this.game.audio.playSound('move');
  }
  
  activateUndo(powerUp) {
    if (!powerUp.use(this.game)) return;
    
    // Undo last 2 moves (player + AI)
    if (this.game.moveHistory && this.game.moveHistory.length >= 2) {
      for (let i = 0; i < 2; i++) {
        const lastMove = this.game.moveHistory.pop();
        if (lastMove) {
          this.game.board[lastMove.index] = '';
          this.game.cells[lastMove.index].userData.empty = true;
          
          // Remove piece from scene
          const piece = this.game.pieces.pop();
          if (piece) this.game.scene.remove(piece);
        }
      }
      this.showMessage('⏪ LAST MOVE UNDONE!', '#9C27B0');
    } else {
      this.showMessage('❌ No moves to undo!', '#ff4444');
      powerUp.owned++; // Return the power-up
    }
    
    this.updateUI();
    if (this.game.audio) this.game.audio.playSound('move');
  }
  
  activateScan(powerUp) {
    if (!powerUp.use(this.game)) return;
    
    // Find AI's next move
    const aiMove = this.game.findWinningMove('O') ||
                   this.game.findWinningMove('X') ||
                   (this.game.board[4] === '' ? 4 : null);
    
    if (aiMove !== null) {
      // Highlight the cell briefly
      const cell = this.game.cells[aiMove];
      const originalEmissive = cell.material.emissive.getHex();
      cell.material.emissive.setHex(0xff9800);
      cell.material.emissiveIntensity = 0.8;
      
      setTimeout(() => {
        cell.material.emissive.setHex(originalEmissive);
        cell.material.emissiveIntensity = 0;
      }, 2000);
      
      this.showMessage('👁️ AI will likely play there!', '#ff9800');
    } else {
      this.showMessage('👁️ AI move is uncertain', '#ff9800');
    }
    
    this.updateUI();
    if (this.game.audio) this.game.audio.playSound('move');
  }
  
  showMessage(text, color) {
    const existing = document.getElementById('powerUpMessage');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.id = 'powerUpMessage';
    message.textContent = text;
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: ${color};
      padding: 20px 40px;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      z-index: 1000;
      border: 3px solid ${color};
      box-shadow: 0 0 30px ${color};
      animation: powerUpPulse 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transition = 'opacity 0.5s ease';
      setTimeout(() => message.remove(), 500);
    }, 2000);
  }
  
  updateUI() {
    Object.keys(this.powerUps).forEach(key => {
      const powerUp = this.powerUps[key];
      const button = document.getElementById(`powerup-${key}`);
      if (!button) return;
      
      const count = button.querySelector('.powerup-count');
      const cooldown = button.querySelector('.powerup-cooldown');
      
      // Update count
      if (count) count.textContent = powerUp.owned;
      
      // Update cooldown
      if (cooldown) {
        if (powerUp.cooldownRemaining > 0) {
          cooldown.textContent = powerUp.cooldownRemaining;
          cooldown.style.display = 'block';
        } else {
          cooldown.style.display = 'none';
        }
      }
      
      // Update appearance
      if (!powerUp.canUse(this.game)) {
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
      } else {
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
      }
    });
  }
  
  updateCooldowns() {
    Object.values(this.powerUps).forEach(powerUp => {
      powerUp.updateCooldown();
    });
    this.updateUI();
  }
  
  earnPowerUp(type) {
    if (this.powerUps[type]) {
      this.powerUps[type].owned++;
      this.showMessage(`✨ Earned: ${this.powerUps[type].icon} ${this.powerUps[type].name}!`, '#FFD700');
      this.updateUI();
    }
  }
  
  randomReward() {
    // 20% chance to earn a random power-up after winning
    if (Math.random() < 0.2) {
      const types = Object.keys(this.powerUps);
      const randomType = types[Math.floor(Math.random() * types.length)];
      this.earnPowerUp(randomType);
    }
  }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes powerUpPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
  }
`;
document.head.appendChild(style);

