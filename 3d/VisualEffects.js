// Visual Effects System
// Handles camera shake, zoom, transitions, and other visual polish

class VisualEffects {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.originalPosition = camera.position.clone();
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.isShaking = false;
    
    // Post-processing effects
    this.screenFlashActive = false;
    this.flashOpacity = 0;
    this.flashColor = '#ffffff';
    
    this.createFlashOverlay();
  }
  
  // Create screen flash overlay
  createFlashOverlay() {
    this.flashOverlay = document.createElement('div');
    this.flashOverlay.id = 'screenFlash';
    this.flashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: white;
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.1s ease;
    `;
    document.body.appendChild(this.flashOverlay);
  }
  
  // Camera shake effect
  shake(intensity = 0.1, duration = 300) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.isShaking = true;
    this.originalPosition = this.camera.position.clone();
    
    const startTime = Date.now();
    
    const shakeLoop = () => {
      if (!this.isShaking) return;
      
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        this.isShaking = false;
        this.camera.position.copy(this.originalPosition);
        return;
      }
      
      // Decay intensity over time
      const currentIntensity = intensity * (1 - progress);
      
      this.camera.position.x = this.originalPosition.x + (Math.random() - 0.5) * currentIntensity;
      this.camera.position.y = this.originalPosition.y + (Math.random() - 0.5) * currentIntensity;
      this.camera.position.z = this.originalPosition.z + (Math.random() - 0.5) * currentIntensity;
      
      requestAnimationFrame(shakeLoop);
    };
    
    shakeLoop();
  }
  
  // Screen flash effect
  flash(color = '#ffffff', intensity = 1, duration = 200) {
    this.flashOverlay.style.background = color;
    this.flashOverlay.style.opacity = intensity;
    
    setTimeout(() => {
      this.flashOverlay.style.transition = `opacity ${duration}ms ease`;
      this.flashOverlay.style.opacity = '0';
    }, 50);
  }
  
  // Camera zoom effect
  zoom(targetFOV, duration = 500) {
    const startFOV = this.camera.fov;
    const startTime = Date.now();
    
    const zoomLoop = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      this.camera.fov = startFOV + (targetFOV - startFOV) * eased;
      this.camera.updateProjectionMatrix();
      
      if (progress < 1) {
        requestAnimationFrame(zoomLoop);
      }
    };
    
    zoomLoop();
  }
  
  // Win celebration effect
  winCelebration() {
    // Flash white
    this.flash('#00ff88', 0.3, 300);
    
    // Gentle shake
    this.shake(0.05, 200);
    
    // Zoom out slightly
    setTimeout(() => this.zoom(55, 800), 100);
    setTimeout(() => this.zoom(50, 800), 1000);
  }
  
  // Lose effect
  loseEffect() {
    // Flash red
    this.flash('#ff4444', 0.4, 400);
    
    // Stronger shake
    this.shake(0.15, 400);
    
    // Quick zoom in and out
    this.zoom(45, 200);
    setTimeout(() => this.zoom(50, 600), 250);
  }
  
  // Level up effect
  levelUpEffect() {
    // Flash gold
    this.flash('#FFD700', 0.5, 500);
    
    // Shake
    this.shake(0.08, 300);
    
    // Dramatic zoom
    this.zoom(45, 400);
    setTimeout(() => this.zoom(50, 800), 500);
  }
  
  // Power-up activation effect
  powerUpEffect(color = '#00d4ff') {
    this.flash(color, 0.25, 150);
    this.shake(0.03, 150);
  }
  
  // Slow motion effect (visual feedback)
  slowMotion(duration = 1000) {
    // Reduce animation speeds (this is visual feedback, actual game logic handles timing)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #00d4ff;
      font-size: 48px;
      font-weight: bold;
      text-shadow: 0 0 20px #00d4ff;
      pointer-events: none;
      z-index: 10000;
      animation: slowMoFade 1s ease;
    `;
    overlay.textContent = '⏰ TIME FREEZE';
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), duration);
  }
  
  // Explosion effect (visual feedback)
  explosionEffect() {
    this.flash('#ff8800', 0.6, 300);
    this.shake(0.2, 500);
  }
  
  // Pulse effect for UI elements
  pulseElement(element, scale = 1.2, duration = 300) {
    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `scale(${scale})`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration);
  }
  
  // Glow effect for objects
  addGlow(mesh, color = 0x00ff88, intensity = 0.5) {
    mesh.material.emissive = new THREE.Color(color);
    mesh.material.emissiveIntensity = intensity;
  }
  
  // Remove glow
  removeGlow(mesh) {
    mesh.material.emissiveIntensity = 0;
  }
  
  // Animate glow (pulsing)
  animateGlow(mesh, color = 0x00ff88, speed = 2) {
    const startTime = Date.now();
    
    const glowLoop = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const intensity = (Math.sin(elapsed * speed) + 1) / 2 * 0.5;
      
      if (mesh.material) {
        mesh.material.emissive = new THREE.Color(color);
        mesh.material.emissiveIntensity = intensity;
      }
    };
    
    return glowLoop;
  }
  
  // Create floating text
  createFloatingText(text, position, color = '#00ff88', duration = 2000) {
    const textElement = document.createElement('div');
    textElement.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: ${color};
      font-size: 36px;
      font-weight: bold;
      text-shadow: 0 0 20px ${color};
      pointer-events: none;
      z-index: 10000;
      animation: floatUp ${duration}ms ease-out forwards;
    `;
    textElement.textContent = text;
    document.body.appendChild(textElement);
    
    setTimeout(() => textElement.remove(), duration);
  }
  
  // Create points popup
  createPointsPopup(points, position, isPositive = true) {
    const color = isPositive ? '#00ff88' : '#ff4444';
    const prefix = isPositive ? '+' : '';
    
    this.createFloatingText(`${prefix}${points}`, position, color, 1500);
  }
  
  // Cleanup
  destroy() {
    if (this.flashOverlay && this.flashOverlay.parentNode) {
      this.flashOverlay.remove();
    }
  }
}

// Add CSS animations
const vfxStyle = document.createElement('style');
vfxStyle.textContent = `
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) translateY(0) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) translateY(-30px) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) translateY(-60px) scale(0.8);
    }
  }
  
  @keyframes slowMoFade {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
    80% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
  
  @keyframes screenShake {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2px, 2px); }
    20% { transform: translate(2px, -2px); }
    30% { transform: translate(-2px, -2px); }
    40% { transform: translate(2px, 2px); }
    50% { transform: translate(-2px, 2px); }
    60% { transform: translate(2px, -2px); }
    70% { transform: translate(-2px, -2px); }
    80% { transform: translate(2px, 2px); }
    90% { transform: translate(-2px, -2px); }
  }
`;
document.head.appendChild(vfxStyle);

