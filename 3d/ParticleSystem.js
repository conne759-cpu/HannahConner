// Particle Effects System for 3D Game

class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particleGroups = [];
  }
  
  // Win celebration particles
  createWinParticles(position) {
    const particleCount = 150; // More particles!
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      
      // Random velocity with more upward force
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.25,
        Math.random() * 0.4 + 0.2, // More upward
        (Math.random() - 0.5) * 0.25
      );
      
      particle.life = 80; // Lasts longer
      particle.initialLife = 80;
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'confetti',
      update: this.updateConfetti
    });
    
    return particles;
  }
  
  // Fireworks effect for major wins
  createFireworks(position, color = 0x00ff88) {
    const particleCount = 80;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.04, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      
      // Circular explosion pattern
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 0.15 + Math.random() * 0.1;
      particle.velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + Math.random() * 0.1,
        Math.sin(angle * 2) * speed
      );
      
      particle.life = 60;
      particle.initialLife = 60;
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'fireworks',
      update: this.updateFireworks
    });
    
    return particles;
  }
  
  // Level up particles
  createLevelUpEffect(position) {
    const particleCount = 100;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.04, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xFFD700, // Gold color
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      particle.position.y -= 2; // Start below
      
      // Upward spiral
      particle.velocity = new THREE.Vector3(
        Math.cos(i * 0.5) * 0.1,
        0.15 + Math.random() * 0.1,
        Math.sin(i * 0.5) * 0.1
      );
      
      particle.life = 100;
      particle.initialLife = 100;
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'levelup',
      update: this.updateLevelUp
    });
    
    return particles;
  }
  
  // Explosion particles for bomb power-up
  createExplosion(position) {
    const particleCount = 50;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.03, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xff4400),
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      
      // Explosive velocity
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 0.15 + Math.random() * 0.1;
      particle.velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * speed,
        Math.sin(angle) * speed
      );
      
      particle.life = 40;
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'explosion',
      update: this.updateExplosion
    });
    
    // Play explosion sound
    if (window.gameAudio) {
      window.gameAudio.playSound('lose'); // Using lose sound for explosion
    }
    
    return particles;
  }
  
  // Freeze effect particles
  createFreezeEffect(position) {
    const particleCount = 30;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.02, 6, 6);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      particle.position.y += (Math.random() - 0.5) * 2;
      
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        -0.02,
        (Math.random() - 0.5) * 0.05
      );
      
      particle.life = 50;
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'freeze',
      update: this.updateFreeze
    });
    
    return particles;
  }
  
  // Shield effect particles
  createShieldEffect(position) {
    const particleCount = 20;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.03, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.6
      });
      
      const particle = new THREE.Mesh(geometry, material);
      const angle = (Math.PI * 2 * i) / particleCount;
      const radius = 0.5;
      
      particle.position.set(
        position.x + Math.cos(angle) * radius,
        position.y,
        position.z + Math.sin(angle) * radius
      );
      
      particle.angle = angle;
      particle.radius = radius;
      particle.centerPos = position.clone();
      particle.life = 120; // Lasts longer
      
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'shield',
      update: this.updateShield
    });
    
    return particles;
  }
  
  // Sparkle effect for placement
  createSparkles(position) {
    const particleCount = 20;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.02, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        Math.random() * 0.15,
        (Math.random() - 0.5) * 0.1
      );
      
      particle.life = 30;
      particles.add(particle);
    }
    
    this.scene.add(particles);
    this.particleGroups.push({
      group: particles,
      type: 'sparkle',
      update: this.updateSparkle
    });
    
    return particles;
  }
  
  // Update functions for different particle types
  updateConfetti(particles) {
    particles.children.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.velocity.y -= 0.008; // Stronger gravity
      particle.rotation.x += 0.15;
      particle.rotation.y += 0.15;
      particle.rotation.z += 0.1;
      
      particle.life--;
      particle.material.opacity = Math.max(0, particle.life / particle.initialLife);
    });
  }
  
  updateFireworks(particles) {
    particles.children.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.velocity.multiplyScalar(0.97); // Deceleration
      particle.velocity.y -= 0.01; // Gravity
      
      particle.life--;
      particle.material.opacity = Math.max(0, particle.life / particle.initialLife);
      
      // Twinkle effect
      particle.scale.setScalar(1 + Math.sin(particle.life * 0.5) * 0.3);
    });
  }
  
  updateLevelUp(particles) {
    particles.children.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.velocity.y += 0.002; // Slight upward acceleration
      
      // Spiral motion
      const angle = particle.life * 0.1;
      particle.position.x += Math.cos(angle) * 0.02;
      particle.position.z += Math.sin(angle) * 0.02;
      
      particle.life--;
      particle.material.opacity = Math.max(0, particle.life / particle.initialLife);
      
      // Pulsing scale
      particle.scale.setScalar(1 + Math.sin(particle.life * 0.2) * 0.5);
    });
  }
  
  updateExplosion(particles) {
    particles.children.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.velocity.multiplyScalar(0.95); // Friction
      
      particle.life--;
      particle.material.opacity = particle.life / 40;
      particle.scale.multiplyScalar(1.02); // Grow slightly
    });
  }
  
  updateFreeze(particles) {
    particles.children.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.rotation.y += 0.05;
      
      particle.life--;
      particle.material.opacity = 0.8 * (particle.life / 50);
    });
  }
  
  updateShield(particles) {
    particles.children.forEach(particle => {
      particle.angle += 0.05;
      particle.position.x = particle.centerPos.x + Math.cos(particle.angle) * particle.radius;
      particle.position.z = particle.centerPos.z + Math.sin(particle.angle) * particle.radius;
      particle.position.y = particle.centerPos.y + Math.sin(particle.angle * 2) * 0.1;
      
      particle.life--;
      particle.material.opacity = 0.6 * (particle.life / 120);
    });
  }
  
  updateSparkle(particles) {
    particles.children.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.velocity.multiplyScalar(0.9);
      
      particle.life--;
      particle.material.opacity = particle.life / 30;
    });
  }
  
  // Update all particle systems
  update() {
    for (let i = this.particleGroups.length - 1; i >= 0; i--) {
      const group = this.particleGroups[i];
      
      // Update particles
      group.update.call(this, group.group);
      
      // Check if all particles are dead
      const allDead = group.group.children.every(p => p.life <= 0);
      
      if (allDead) {
        this.scene.remove(group.group);
        this.particleGroups.splice(i, 1);
      }
    }
  }
  
  // Clear all particles
  clear() {
    this.particleGroups.forEach(group => {
      this.scene.remove(group.group);
    });
    this.particleGroups = [];
  }
}

