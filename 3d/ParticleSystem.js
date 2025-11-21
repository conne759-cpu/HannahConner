// Particle Effects System for 3D Game

class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particleGroups = [];
  }
  
  // Win celebration particles
  createWinParticles(position) {
    const particleCount = 100;
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
      
      // Random velocity
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        Math.random() * 0.3,
        (Math.random() - 0.5) * 0.2
      );
      
      particle.life = 60; // frames
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
      particle.velocity.y -= 0.005; // Gravity
      particle.rotation.x += 0.1;
      particle.rotation.y += 0.1;
      
      particle.life--;
      particle.material.opacity = particle.life / 60;
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

