// Game Mode Selector - Choose between 2D, 3D, and Cube modes
// Integrated menu system with smooth transitions

class GameModeSelector {
  constructor() {
    this.modes = {
      classic2D: {
        name: '2D Classic',
        icon: '📋',
        description: 'Classic Tic Tac Toe with levels & power-ups',
        file: 'game.html',
        difficulty: 'Easy to Master'
      },
      
      classic3D: {
        name: '3D Grid',
        icon: '🎮',
        description: '3x3 grid in 3D space with immersive gameplay',
        file: 'game3d.html',
        difficulty: 'Intermediate'
      },
      
      cube3D: {
        name: '3D Cube',
        icon: '🎲',
        description: '3x3x3 cube - ultimate challenge!',
        file: 'game3dcube.html',
        difficulty: 'Expert'
      }
    };
    
    this.createMenu();
  }
  
  createMenu() {
    // Remove existing menu if present
    const existing = document.getElementById('gameModeMenu');
    if (existing) existing.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'gameModeMenu';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s ease;
    `;
    
    // Title
    const title = document.createElement('div');
    title.innerHTML = `
      <h1 style="
        color: #00ff88;
        font-size: 60px;
        margin: 0 0 10px 0;
        text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88;
        animation: pulse 2s infinite;
      ">TIC TAC TOE</h1>
      <p style="
        color: #00d4ff;
        font-size: 20px;
        margin: 0 0 50px 0;
        text-align: center;
      ">Choose Your Game Mode</p>
    `;
    overlay.appendChild(title);
    
    // Mode cards container
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 1200px;
      padding: 20px;
    `;
    
    // Create mode cards
    Object.keys(this.modes).forEach((modeKey, index) => {
      const mode = this.modes[modeKey];
      const card = this.createModeCard(modeKey, mode, index);
      container.appendChild(card);
    });
    
    overlay.appendChild(container);
    
    // Stats section
    const stats = this.createStatsSection();
    overlay.appendChild(stats);
    
    // Add to page
    document.body.appendChild(overlay);
  }
  
  createModeCard(modeKey, mode, index) {
    const card = document.createElement('div');
    card.className = 'mode-card';
    card.style.cssText = `
      width: 300px;
      padding: 30px;
      background: rgba(42, 42, 42, 0.6);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(0, 255, 136, 0.3);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease ${index * 0.1}s backwards;
    `;
    
    // Icon
    const icon = document.createElement('div');
    icon.textContent = mode.icon;
    icon.style.cssText = `
      font-size: 80px;
      text-align: center;
      margin-bottom: 20px;
    `;
    card.appendChild(icon);
    
    // Name
    const name = document.createElement('h2');
    name.textContent = mode.name;
    name.style.cssText = `
      color: #00ff88;
      font-size: 28px;
      margin: 0 0 10px 0;
      text-align: center;
    `;
    card.appendChild(name);
    
    // Description
    const desc = document.createElement('p');
    desc.textContent = mode.description;
    desc.style.cssText = `
      color: rgba(255, 255, 255, 0.8);
      font-size: 16px;
      text-align: center;
      margin: 0 0 15px 0;
      line-height: 1.5;
    `;
    card.appendChild(desc);
    
    // Difficulty badge
    const difficulty = document.createElement('div');
    difficulty.textContent = mode.difficulty;
    difficulty.style.cssText = `
      display: inline-block;
      padding: 8px 16px;
      background: rgba(0, 212, 255, 0.2);
      color: #00d4ff;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
      margin: 10px auto;
      text-align: center;
    `;
    const diffContainer = document.createElement('div');
    diffContainer.style.textAlign = 'center';
    diffContainer.appendChild(difficulty);
    card.appendChild(diffContainer);
    
    // Play button
    const button = document.createElement('button');
    button.textContent = 'PLAY NOW';
    button.style.cssText = `
      width: 100%;
      padding: 15px;
      margin-top: 20px;
      background: linear-gradient(135deg, #00ff88, #00d4ff);
      color: black;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    card.appendChild(button);
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.05)';
      card.style.borderColor = '#00ff88';
      card.style.boxShadow = '0 20px 60px rgba(0, 255, 136, 0.4)';
      button.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.borderColor = 'rgba(0, 255, 136, 0.3)';
      card.style.boxShadow = 'none';
      button.style.transform = 'scale(1)';
    });
    
    // Click handler
    card.addEventListener('click', () => this.selectMode(modeKey, mode));
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectMode(modeKey, mode);
    });
    
    return card;
  }
  
  createStatsSection() {
    const stats = document.createElement('div');
    stats.style.cssText = `
      margin-top: 50px;
      padding: 30px;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 2px solid rgba(0, 255, 136, 0.2);
      max-width: 800px;
    `;
    
    const title = document.createElement('h3');
    title.textContent = '📊 Your Progress';
    title.style.cssText = `
      color: #00ff88;
      font-size: 24px;
      margin: 0 0 20px 0;
      text-align: center;
    `;
    stats.appendChild(title);
    
    // Load stats from localStorage
    const savedStats = {
      level: parseInt(localStorage.getItem('level')) || 1,
      score: parseInt(localStorage.getItem('score')) || 0,
      wins: parseInt(localStorage.getItem('wins')) || 0,
      gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0
    };
    
    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    `;
    
    const statItems = [
      { label: 'Level', value: savedStats.level, color: '#00ff88' },
      { label: 'Score', value: savedStats.score.toLocaleString(), color: '#00d4ff' },
      { label: 'Wins', value: savedStats.wins, color: '#ff8800' },
      { label: 'Games', value: savedStats.gamesPlayed, color: '#ff4444' }
    ];
    
    statItems.forEach(item => {
      const statDiv = document.createElement('div');
      statDiv.style.cssText = `
        text-align: center;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      `;
      
      const value = document.createElement('div');
      value.textContent = item.value;
      value.style.cssText = `
        font-size: 36px;
        font-weight: bold;
        color: ${item.color};
        margin-bottom: 5px;
      `;
      
      const label = document.createElement('div');
      label.textContent = item.label;
      label.style.cssText = `
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      `;
      
      statDiv.appendChild(value);
      statDiv.appendChild(label);
      statsGrid.appendChild(statDiv);
    });
    
    stats.appendChild(statsGrid);
    
    return stats;
  }
  
  selectMode(modeKey, mode) {
    // Animate out
    const menu = document.getElementById('gameModeMenu');
    menu.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
      // Navigate to selected game
      window.location.href = mode.file;
    }, 300);
  }
  
  addBackButton(targetPage = 'index.html') {
    const button = document.createElement('button');
    button.innerHTML = '← Back to Menu';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 12px 24px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      color: #00ff88;
      border: 2px solid rgba(0, 255, 136, 0.5);
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(0, 255, 136, 0.2)';
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(0, 0, 0, 0.8)';
      button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => {
      window.location.href = targetPage;
    });
    
    document.body.appendChild(button);
  }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @media (max-width: 768px) {
    .mode-card {
      width: 100% !important;
      max-width: 300px;
    }
  }
`;
document.head.appendChild(style);

