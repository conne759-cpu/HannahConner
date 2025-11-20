// Audio System for Tic Tac Toe Game
class GameAudio {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
    this.backgroundMusicPlaying = false;
    this.sounds = {};
    this.initAudio();
    this.loadSounds();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio system initialized successfully');
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      this.isEnabled = false;
    }
  }

  loadSounds() {
    // Load actual audio files
    const soundFiles = {
      win: 'audio/win.wav',
      lose: 'audio/lose.wav',
      move: 'audio/move.wav'
    };

    try {
      Object.keys(soundFiles).forEach(key => {
        this.sounds[key] = new Audio(soundFiles[key]);
        this.sounds[key].volume = 0.5;
        this.sounds[key].load();
      });
      console.log('Audio files loaded successfully');
    } catch (e) {
      console.warn('Failed to load audio files:', e);
    }
  }

  playSound(soundName) {
    if (!this.isEnabled) return;
    
    try {
      if (this.sounds[soundName]) {
        // Clone the audio to allow multiple overlapping plays
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = 0.5;
        sound.play().catch(e => console.warn(`Failed to play ${soundName}:`, e));
      }
    } catch (e) {
      console.warn(`Error playing ${soundName}:`, e);
    }
  }

  // Resume audio context if suspended (required by browsers)
  async resumeAudioContext() {
    try {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (e) {
      console.warn('Failed to resume audio context:', e);
    }
  }

  // Generate a tone with specified frequency, duration, and type
  playTone(frequency, duration = 200, type = 'sine', volume = 0.3) {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Failed to play tone:', e);
    }
  }

  // Game sound effects using actual audio files
  playClickSound() {
    if (!this.isEnabled) return;
    this.playSound('move');
  }

  playPlayerMove() {
    if (!this.isEnabled) return;
    this.playSound('move');
  }

  playComputerMove() {
    if (!this.isEnabled) return;
    this.playSound('move');
  }

  playWinSound(isPlayer = true) {
    if (!this.isEnabled) return;
    if (isPlayer) {
      // Player wins - play win sound
      this.playSound('win');
    } else {
      // Computer wins - play lose sound
      this.playSound('lose');
    }
  }

  playTieSound() {
    if (!this.isEnabled) return;
    // Use move sound for tie as neutral sound
    this.playSound('move');
  }

  playGameStart() {
    if (!this.isEnabled) return;
    // Use move sound for game start
    this.playSound('move');
  }

  // Background music - simple loop
  startBackgroundMusic() {
    if (!this.isEnabled || !this.audioContext || this.backgroundMusicPlaying) return;
    
    this.backgroundMusicPlaying = true;
    this.playBackgroundLoop();
  }

  stopBackgroundMusic() {
    this.backgroundMusicPlaying = false;
  }

  playBackgroundLoop() {
    if (!this.backgroundMusicPlaying) return;

    try {
      // Simple upbeat background music
      const melody = [
        { freq: 523, duration: 200 }, // C5
        { freq: 587, duration: 200 }, // D5
        { freq: 659, duration: 200 }, // E5
        { freq: 698, duration: 200 }, // F5
        { freq: 784, duration: 400 }, // G5
        { freq: 698, duration: 200 }, // F5
        { freq: 659, duration: 200 }, // E5
        { freq: 587, duration: 200 }, // D5
      ];

      let timeOffset = 0;
      melody.forEach((note, index) => {
        setTimeout(() => {
          if (this.backgroundMusicPlaying) {
            this.playTone(note.freq, note.duration, 'sine', 0.1);
          }
        }, timeOffset);
        timeOffset += note.duration;
      });

      // Loop the music
      setTimeout(() => {
        if (this.backgroundMusicPlaying) {
          this.playBackgroundLoop();
        }
      }, timeOffset + 500);
    } catch (e) {
      console.warn('Background music loop failed:', e);
      this.backgroundMusicPlaying = false;
    }
  }

  // Audio control methods
  toggleMute() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stopBackgroundMusic();
    }
    return this.isEnabled;
  }

  setVolume(volume) {
    // This would control overall volume in a more complex implementation
    console.log('Volume set to:', volume);
  }
}

// Export for use in other files
window.GameAudio = GameAudio;

// Initialize game audio when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.gameAudio = new GameAudio();
    console.log('Game audio initialized');
  });
} else {
  window.gameAudio = new GameAudio();
  console.log('Game audio initialized');
}

// Global function to toggle music/sound
window.toggleMusic = function() {
  if (window.gameAudio) {
    const isEnabled = window.gameAudio.toggleMute();
    const button = document.getElementById('musicButton');
    if (button) {
      if (isEnabled) {
        button.textContent = '🎵 Music On';
        button.classList.remove('muted');
      } else {
        button.textContent = '🔇 Music Off';
        button.classList.add('muted');
      }
    }
    console.log('Audio ' + (isEnabled ? 'enabled' : 'disabled'));
  }
};
