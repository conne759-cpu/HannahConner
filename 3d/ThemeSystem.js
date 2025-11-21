// Theme System for 3D Tic Tac Toe
// Multiple visual themes with different aesthetics

class ThemeSystem {
  constructor(game) {
    this.game = game;
    this.currentTheme = 'classic';
    
    this.themes = {
      classic: {
        name: 'Classic',
        icon: '🎨',
        background: 0x0a0a0a,
        boardColor: 0x2a2a2a,
        cellColor: 0x1a1a1a,
        gridColor: 0x00ff88,
        playerColor: 0x00ff88,
        opponentColor: 0xff4444,
        ambientLight: 0xffffff,
        ambientIntensity: 0.4,
        pointLight1Color: 0x00ff88,
        pointLight2Color: 0x00d4ff,
        fog: true,
        fogColor: 0x0a0a0a
      },
      
      neon: {
        name: 'Neon Cyberpunk',
        icon: '🌆',
        background: 0x0d0221,
        boardColor: 0x1a0f3d,
        cellColor: 0x0f0728,
        gridColor: 0xff00ff,
        playerColor: 0x00ffff,
        opponentColor: 0xff0080,
        ambientLight: 0xff00ff,
        ambientIntensity: 0.3,
        pointLight1Color: 0xff00ff,
        pointLight2Color: 0x00ffff,
        fog: true,
        fogColor: 0x0d0221,
        glow: true
      },
      
      space: {
        name: 'Space',
        icon: '🚀',
        background: 0x000510,
        boardColor: 0x1a1a2e,
        cellColor: 0x0f0f1e,
        gridColor: 0x4a90e2,
        playerColor: 0x4a90e2,
        opponentColor: 0xff6b6b,
        ambientLight: 0x4a90e2,
        ambientIntensity: 0.2,
        pointLight1Color: 0x4a90e2,
        pointLight2Color: 0xffffff,
        fog: false,
        stars: true
      },
      
      nature: {
        name: 'Nature',
        icon: '🌿',
        background: 0x1a3a1a,
        boardColor: 0x3d5a3d,
        cellColor: 0x2d4a2d,
        gridColor: 0x90ee90,
        playerColor: 0x90ee90,
        opponentColor: 0xff8c42,
        ambientLight: 0x90ee90,
        ambientIntensity: 0.5,
        pointLight1Color: 0x90ee90,
        pointLight2Color: 0xffeb3b,
        fog: true,
        fogColor: 0x1a3a1a
      },
      
      ice: {
        name: 'Ice',
        icon: '❄️',
        background: 0x0a1929,
        boardColor: 0x1e3a5f,
        cellColor: 0x0d2847,
        gridColor: 0x00d4ff,
        playerColor: 0x00d4ff,
        opponentColor: 0xff4081,
        ambientLight: 0x00d4ff,
        ambientIntensity: 0.3,
        pointLight1Color: 0x00d4ff,
        pointLight2Color: 0xffffff,
        fog: true,
        fogColor: 0x0a1929,
        crystals: true
      },
      
      fire: {
        name: 'Fire',
        icon: '🔥',
        background: 0x1a0000,
        boardColor: 0x3d1010,
        cellColor: 0x2d0808,
        gridColor: 0xff4400,
        playerColor: 0xff8800,
        opponentColor: 0x00ffaa,
        ambientLight: 0xff4400,
        ambientIntensity: 0.4,
        pointLight1Color: 0xff4400,
        pointLight2Color: 0xff8800,
        fog: true,
        fogColor: 0x1a0000,
        embers: true
      }
    };
    
    this.createThemeUI();
  }
  
  createThemeUI() {
    const existing = document.getElementById('themeSelector');
    if (existing) existing.remove();
    
    const panel = document.createElement('div');
    panel.id = 'themeSelector';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      border: 2px solid rgba(0, 255, 136, 0.3);
      z-index: 100;
    `;
    
    // Title
    const title = document.createElement('div');
    title.textContent = 'THEMES';
    title.style.cssText = `
      color: white;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
      opacity: 0.8;
    `;
    panel.appendChild(title);
    
    // Theme buttons
    Object.keys(this.themes).forEach(themeKey => {
      const theme = this.themes[themeKey];
      const button = this.createThemeButton(themeKey, theme);
      panel.appendChild(button);
    });
    
    document.body.appendChild(panel);
  }
  
  createThemeButton(themeKey, theme) {
    const button = document.createElement('div');
    button.id = `theme-${themeKey}`;
    button.className = 'theme-button';
    button.style.cssText = `
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #${theme.playerColor.toString(16).padStart(6, '0')}, #${theme.opponentColor.toString(16).padStart(6, '0')});
      border: 2px solid ${themeKey === this.currentTheme ? '#00ff88' : 'rgba(255, 255, 255, 0.3)'};
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 24px;
      user-select: none;
    `;
    
    button.textContent = theme.icon;
    button.title = theme.name;
    
    button.addEventListener('click', () => this.applyTheme(themeKey));
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.borderColor = '#00ff88';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.borderColor = themeKey === this.currentTheme ? '#00ff88' : 'rgba(255, 255, 255, 0.3)';
    });
    
    return button;
  }
  
  applyTheme(themeKey) {
    if (!this.themes[themeKey]) return;
    
    const theme = this.themes[themeKey];
    this.currentTheme = themeKey;
    
    // Update button borders
    Object.keys(this.themes).forEach(key => {
      const button = document.getElementById(`theme-${key}`);
      if (button) {
        button.style.borderColor = key === themeKey ? '#00ff88' : 'rgba(255, 255, 255, 0.3)';
      }
    });
    
    // Apply to scene
    this.game.scene.background = new THREE.Color(theme.background);
    
    // Update fog
    if (theme.fog) {
      this.game.scene.fog = new THREE.Fog(theme.fogColor, 10, 50);
    } else {
      this.game.scene.fog = null;
    }
    
    // Update board materials
    if (this.game.boardMesh) {
      this.game.boardMesh.material.color.setHex(theme.boardColor);
    }
    
    // Update cells
    this.game.cells.forEach(cell => {
      cell.material.color.setHex(theme.cellColor);
    });
    
    // Update lights
    if (this.game.lights && this.game.lights.length > 0) {
      this.game.lights[0].color.setHex(theme.ambientLight);
      this.game.lights[0].intensity = theme.ambientIntensity;
      
      if (this.game.lights[2]) {
        this.game.lights[2].color.setHex(theme.pointLight1Color);
      }
      if (this.game.lights[3]) {
        this.game.lights[3].color.setHex(theme.pointLight2Color);
      }
    }
    
    // Add special effects
    if (theme.stars) {
      this.addStarField();
    } else {
      this.removeStarField();
    }
    
    // Show theme change message
    this.showThemeMessage(theme.name);
    
    // Save preference
    localStorage.setItem('tictactoe_theme', themeKey);
  }
  
  addStarField() {
    // Remove existing stars
    this.removeStarField();
    
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });
    
    this.starField = new THREE.Points(starGeometry, starMaterial);
    this.game.scene.add(this.starField);
  }
  
  removeStarField() {
    if (this.starField) {
      this.game.scene.remove(this.starField);
      this.starField = null;
    }
  }
  
  showThemeMessage(themeName) {
    const existing = document.getElementById('themeMessage');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.id = 'themeMessage';
    message.textContent = `🎨 ${themeName} Theme`;
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #00ff88;
      padding: 20px 40px;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      z-index: 1000;
      border: 3px solid #00ff88;
      box-shadow: 0 0 30px #00ff88;
      animation: themeAppear 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transition = 'opacity 0.5s ease';
      setTimeout(() => message.remove(), 500);
    }, 1500);
  }
  
  loadSavedTheme() {
    const saved = localStorage.getItem('tictactoe_theme');
    if (saved && this.themes[saved]) {
      this.applyTheme(saved);
    }
  }
}

// Add CSS animation
const themeStyle = document.createElement('style');
themeStyle.textContent = `
  @keyframes themeAppear {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  
  @media (max-width: 768px) {
    #themeSelector {
      right: 10px;
      padding: 10px;
      gap: 8px;
    }
    .theme-button {
      width: 40px !important;
      height: 40px !important;
      font-size: 20px !important;
    }
  }
`;
document.head.appendChild(themeStyle);

