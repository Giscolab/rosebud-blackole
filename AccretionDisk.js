import * as THREE from 'three';
import { diskColors } from './config.js';

/**
 * AccretionDisk - Rotating disk of matter around the black hole
 * Simulates orbital mechanics with temperature-based coloring
 */
export class AccretionDisk {
  constructor(scene, blackHole, config) {
    this.scene = scene;
    this.blackHole = blackHole;
    this.config = config;
    this.particles = [];
    this.particleSystem = null;
    this.glowRings = [];
    
    this.applyRadii(this.config.innerRadius, this.config.outerRadius, false);
    this.createDisk();
  }


  sanitizeRadii(innerRadius = this.config.innerRadius, outerRadius = this.config.outerRadius) {
    const minInnerFromBlackHole = this.blackHole.radius + this.config.innerRadiusMargin;
    const innerMin = Math.max(this.config.minInnerRadius, minInnerFromBlackHole);
    const innerMax = Math.min(this.config.maxInnerRadius, this.config.maxOuterRadius - this.config.minOuterGap);

    let safeInner = Math.min(Math.max(innerRadius, innerMin), innerMax);

    const outerMin = Math.max(this.config.minOuterRadius, safeInner + this.config.minOuterGap);
    const outerMax = this.config.maxOuterRadius;
    let safeOuter = Math.min(Math.max(outerRadius, outerMin), outerMax);

    if (safeOuter - safeInner < this.config.minOuterGap) {
      safeOuter = Math.min(outerMax, safeInner + this.config.minOuterGap);
      if (safeOuter - safeInner < this.config.minOuterGap) {
        safeInner = Math.max(innerMin, safeOuter - this.config.minOuterGap);
      }
    }

    return {
      innerRadius: safeInner,
      outerRadius: safeOuter,
      innerMin,
      innerMax,
      outerMin: Math.max(this.config.minOuterRadius, safeInner + this.config.minOuterGap),
      outerMax
    };
  }

  applyRadii(innerRadius, outerRadius, shouldRegenerate = true) {
    const state = this.sanitizeRadii(innerRadius, outerRadius);
    this.config.innerRadius = state.innerRadius;
    this.config.outerRadius = state.outerRadius;

    if (shouldRegenerate) {
      this.regenerateDisk();
    }

    return state;
  }

  getRadiusState() {
    return this.sanitizeRadii(this.config.innerRadius, this.config.outerRadius);
  }

  createDisk() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const velocities = [];

    // Generate particles in disk formation
    for (let i = 0; i < this.config.particleCount; i++) {
      // Random radius between inner and outer disk
      const radius = this.config.innerRadius + 
        Math.random() * (this.config.outerRadius - this.config.innerRadius);
      
      // Random angle
      const angle = Math.random() * Math.PI * 2;
      
      // Position in disk plane with slight thickness
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * this.config.thickness;
      
      positions.push(x, y, z);

      // Color based on temperature (inner = hotter = brighter)
      const temp = 1.0 - ((radius - this.config.innerRadius) / 
        (this.config.outerRadius - this.config.innerRadius));
      
      const color = this.getTemperatureColor(temp);
      colors.push(color.r, color.g, color.b);

      // Orbital velocity (Keplerian: v ∝ 1/√r)
      const orbitalSpeed = this.config.rotationSpeed * Math.sqrt(1.0 / radius);
      velocities.push({
        angle: angle,
        radius: radius,
        speed: orbitalSpeed,
        verticalPhase: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Particle material with additive blending for glow
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: this.config.diskOpacity || 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particles = velocities;
    this.scene.add(this.particleSystem);

    // Add disk glow rings
    this.createGlowRings();
  }

  createGlowRings() {
    // Inner and outer glow rings for atmospheric effect
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
      const radius = this.config.innerRadius + 
        (this.config.outerRadius - this.config.innerRadius) * (i / (ringCount - 1));
      
      const ringGeometry = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: diskColors.warm,
        transparent: true,
        opacity: 0.05 * (1 - i / ringCount),
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      this.scene.add(ring);
      this.glowRings.push(ring);
    }
  }

  disposeGlowRings() {
    for (let i = 0; i < this.glowRings.length; i++) {
      const ring = this.glowRings[i];
      this.scene.remove(ring);
      ring.geometry.dispose();
      ring.material.dispose();
    }
    this.glowRings = [];
  }

  getTemperatureColor(temperature) {
    // Interpolate between cold (blue) and hot (cyan-white)
    const cold = new THREE.Color(diskColors.cold);
    const hot = new THREE.Color(diskColors.hot);
    
    return cold.lerp(hot, temperature);
  }

  update(deltaTime) {
    if (!this.particleSystem) return;

    const positions = this.particleSystem.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    // Update each particle's orbital position
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      // Update orbital angle based on velocity
      particle.angle += particle.speed * deltaTime;
      
      // Calculate new position
      const x = Math.cos(particle.angle) * particle.radius;
      const z = Math.sin(particle.angle) * particle.radius;
      
      // Add slight vertical oscillation for turbulence
      const y = Math.sin(particle.verticalPhase + time * 2) * 
        this.config.thickness * 0.5;
      
      // Apply gravitational perturbation (particles wobble near black hole)
      const perturbation = Math.exp(-particle.radius / 3) * 0.2;
      const wobbleX = Math.sin(time * 3 + i * 0.1) * perturbation;
      const wobbleZ = Math.cos(time * 3 + i * 0.1) * perturbation;

      positions[i * 3] = x + wobbleX;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z + wobbleZ;
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  setInnerRadius(innerRadius) {
    return this.applyRadii(innerRadius, this.config.outerRadius);
  }

  setOuterRadius(outerRadius) {
    return this.applyRadii(this.config.innerRadius, outerRadius);
  }

  onBlackHoleRadiusChange(eventHorizonRadius) {
    this.blackHole.radius = eventHorizonRadius;
    return this.applyRadii(this.config.innerRadius, this.config.outerRadius);
  }

  setRotationSpeed(speed) {
    this.config.rotationSpeed = speed;
    // Update particle velocities
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.speed = speed * Math.sqrt(1.0 / particle.radius);
    }
  }

  regenerateDisk() {
    // Remove old disk and recreate
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
    }

    this.disposeGlowRings();
    this.createDisk();
  }

  setOpacity(opacity) {
    if (this.particleSystem) {
      this.particleSystem.material.opacity = opacity;
    }
  }

  dispose() {
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
      this.particleSystem = null;
    }

    this.particles = [];
    this.disposeGlowRings();
  }
}
