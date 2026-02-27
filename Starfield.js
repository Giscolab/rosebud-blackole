import * as THREE from 'three';

/**
 * Starfield - Distant background stars
 * Creates an immersive deep space environment
 */
export class Starfield {
  constructor(scene, count = 2000) {
    this.scene = scene;
    this.count = count;
    this.starfield = null;

    this.createStarfield();
  }

  createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    // Generate random stars on a sphere
    for (let i = 0; i < this.count; i++) {
      // Random position on sphere (very far away)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 200;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      // Slight color variation (white to blue-white)
      const brightness = 0.7 + Math.random() * 0.3;
      const blueTint = Math.random() * 0.2;
      colors.push(brightness - blueTint, brightness - blueTint * 0.5, brightness);

      // Random star sizes
      sizes.push(Math.random() * 2 + 0.5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Shader material for size attenuation
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: false,
      depthWrite: false
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  /**
   * API publique: met à jour l'animation du fond stellaire.
   * @param {number} deltaTime
   */
  update(_deltaTime) {
    // Subtle twinkling effect
    if (this.starfield) {
      const time = Date.now() * 0.0001;
      const colors = this.starfield.geometry.attributes.color.array;

      for (let i = 0; i < this.count; i++) {
        // Only twinkle 10% of stars
        if (Math.random() > 0.99) {
          const brightness = 0.7 + Math.sin(time * 10 + i) * 0.15;
          const blueTint = Math.random() * 0.2;
          colors[i * 3] = brightness - blueTint;
          colors[i * 3 + 1] = brightness - blueTint * 0.5;
          colors[i * 3 + 2] = brightness;
        }
      }

      this.starfield.geometry.attributes.color.needsUpdate = true;
    }
  }
}
