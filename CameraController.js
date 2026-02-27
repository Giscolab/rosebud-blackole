/**
 * CameraController - Orbital camera around the black hole
 * Handles mouse/keyboard input for smooth camera movement
 */
export class CameraController {
  constructor(camera, target, domElement, config) {
    this.camera = camera;
    this.target = target; // Black hole position
    this.domElement = domElement;
    this.config = config;

    // Spherical coordinates
    this.distance = config.distance;
    this.phi = Math.PI / 2; // Polar angle (0 = top, PI = bottom)
    this.theta = 0; // Azimuthal angle

    // Mouse state
    this.isMouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;

    // Auto-rotate
    this.autoRotate = config.autoRotate;
    this.autoRotateSpeed = config.autoRotateSpeed;

    // Keyboard state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Mouse controls
    this.domElement.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    this.domElement.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    this.domElement.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        const deltaX = e.clientX - this.prevMouseX;
        const deltaY = e.clientY - this.prevMouseY;

        this.theta -= deltaX * 0.005 * this.config.orbitSpeed;
        this.phi += deltaY * 0.005 * this.config.orbitSpeed;

        // Clamp phi to avoid gimbal lock
        this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi));

        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
    });

    // Mouse wheel for zoom
    this.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.distance += e.deltaY * 0.01;
      this.distance = Math.max(
        this.config.minDistance,
        Math.min(this.config.maxDistance, this.distance)
      );
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = true;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = true;
          break;
        case 'q':
          this.keys.up = true;
          break;
        case 'e':
          this.keys.down = true;
          break;
        case ' ':
          this.autoRotate = !this.autoRotate;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = false;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = false;
          break;
        case 'q':
          this.keys.up = false;
          break;
        case 'e':
          this.keys.down = false;
          break;
      }
    });
  }

  /**
   * API publique: met à jour la position caméra selon les entrées.
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // Handle keyboard movement
    const moveSpeed = 10 * deltaTime;

    if (this.keys.forward) this.distance -= moveSpeed;
    if (this.keys.backward) this.distance += moveSpeed;
    if (this.keys.left) this.theta -= moveSpeed * 0.5;
    if (this.keys.right) this.theta += moveSpeed * 0.5;
    if (this.keys.up) this.phi -= moveSpeed * 0.5;
    if (this.keys.down) this.phi += moveSpeed * 0.5;

    // Clamp distance
    this.distance = Math.max(
      this.config.minDistance,
      Math.min(this.config.maxDistance, this.distance)
    );

    // Clamp phi
    this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi));

    // Auto-rotate
    if (this.autoRotate) {
      this.theta += this.autoRotateSpeed * deltaTime;
    }

    // Convert spherical to Cartesian coordinates
    const x = this.distance * Math.sin(this.phi) * Math.cos(this.theta);
    const y = this.distance * Math.cos(this.phi);
    const z = this.distance * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  /**
   * API publique: met à jour la distance caméra avec bornes.
   * @param {number} distance
   */
  setDistance(distance) {
    this.distance = distance;
    this.distance = Math.max(
      this.config.minDistance,
      Math.min(this.config.maxDistance, this.distance)
    );
  }

  setAutoRotate(enabled) {
    this.autoRotate = enabled;
  }
}
