// Audio System for Tic Tac Toe Game using Web Audio API
class GameAudio {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
    this.backgroundMusicPlaying = false;
    this.initAudio();
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

  // Game sound effects
  playClickSound() {
    if (!this.isEnabled) return;
    this.resumeAudioContext().then(() => {
      this.playTone(800, 100, 'square', 0.2);
    }).catch(e => console.warn('Click sound failed:', e));
  }

  playPlayerMove() {
    if (!this.isEnabled) return;
    this.resumeAudioContext().then(() => {
      // Happy bulldog sound effect (ascending tones)
      this.playTone(523, 150, 'sine', 0.3); // C5
      setTimeout(() => this.playTone(659, 150, 'sine', 0.3), 100); // E5
    }).catch(e => console.warn('Player move sound failed:', e));
  }

  playComputerMove() {
    if (!this.isEnabled) return;
    this.resumeAudioContext().then(() => {
      // UMN sound effect (descending tones)
      this.playTone(440, 150, 'triangle', 0.25); // A4
      setTimeout(() => this.playTone(349, 150, 'triangle', 0.25), 100); // F4
    }).catch(e => console.warn('Computer move sound failed:', e));
  }

  playWinSound(isPlayer = true) {
    if (!this.isEnabled) return;
    this.resumeAudioContext().then(() => {
      if (isPlayer) {
        // Bulldogs win - triumphant fanfare
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((note, index) => {
          setTimeout(() => this.playTone(note, 300, 'sine', 0.4), index * 150);
        });
      } else {
        // UMN win - different melody
        const notes = [440, 392, 349, 294]; // A4, G4, F4, D4
        notes.forEach((note, index) => {
          setTimeout(() => this.playTone(note, 250, 'triangle', 0.35), index * 120);
        });
      }
    }).catch(e => console.warn('Win sound failed:', e));
  }

  playTieSound() {
    if (!this.isEnabled) return;
    this.resumeAudioContext().then(() => {
      // Neutral tie sound
      this.playTone(523, 200, 'sine', 0.25);
      setTimeout(() => this.playTone(523, 200, 'sine', 0.25), 150);
    }).catch(e => console.warn('Tie sound failed:', e));
  }

  playGameStart() {
    if (!this.isEnabled) return;
    this.resumeAudioContext().then(() => {
      // Game start sound
      this.playTone(440, 200, 'sawtooth', 0.3);
      setTimeout(() => this.playTone(554, 200, 'sawtooth', 0.3), 100);
      setTimeout(() => this.playTone(659, 300, 'sawtooth', 0.3), 200);
    }).catch(e => console.warn('Game start sound failed:', e));
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
