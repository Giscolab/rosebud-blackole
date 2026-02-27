import * as THREE from 'three';

/**
 * BlackHole - The central singularity and event horizon
 * Represents the gravitational center with visual event horizon
 */
export class BlackHole {
  constructor(scene, radius = 2.0) {
    this.scene = scene;
    this.radius = radius;
    this.mesh = null;
    
    this.createEventHorizon();
    this.createSingularity();
  }

  createEventHorizon() {
    // Event horizon - perfectly black sphere
    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.FrontSide
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // Add subtle rim glow using a slightly larger transparent sphere
    const glowGeometry = new THREE.SphereGeometry(this.radius * 1.05, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.mesh.add(glowMesh);
  }

  createSingularity() {
    // Central point light to represent the singularity's influence
    const pointLight = new THREE.PointLight(0x00ffcc, 2, 50);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);
  }

  setRadius(radius) {
    this.radius = radius;
    if (this.mesh) {
      this.mesh.scale.setScalar(radius / 2.0);
    }
  }

  /**
   * Calculate gravitational influence at a given position
   * Used for particle motion and light bending
   */
  gravitationalForce(position) {
    const distance = position.length();
    if (distance < this.radius) return new THREE.Vector3(0, 0, 0);
    
    // Simplified gravitational force (F ∝ 1/r²)
    const forceMagnitude = (this.radius * this.radius) / (distance * distance * distance);
    return position.clone().multiplyScalar(-forceMagnitude);
  }

  /**
   * Schwarzschild radius check
   */
  isInsideEventHorizon(position) {
    return position.length() < this.radius;
  }

  update(deltaTime) {
    // Subtle pulsing effect for the glow
    if (this.mesh && this.mesh.children[0]) {
      const time = Date.now() * 0.001;
      this.mesh.children[0].material.opacity = 0.1 + Math.sin(time * 2) * 0.05;
    }
  }
}
