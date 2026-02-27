import * as THREE from 'three';
import { config } from './config.js';
import { BlackHole } from './BlackHole.js';
import { AccretionDisk } from './AccretionDisk.js';
import { Starfield } from './Starfield.js';
import { CameraController } from './CameraController.js';
import { UIController } from './UIController.js';

/**
 * Main Application - Black Hole Accretion Disk Visualization
 * Real-time WebGL simulation with interactive physics controls
 */
class BlackHoleSimulation {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.blackHole = null;
    this.accretionDisk = null;
    this.starfield = null;
    this.cameraController = null;
    this.uiController = null;
    this.clock = new THREE.Clock();

    this.init();
    this.animate();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, config.rendering.fogDensity);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      config.camera.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.position.set(0, config.camera.distance * 0.3, config.camera.distance);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000);
    document.body.appendChild(this.renderer.domElement);

    // Create entities
    this.blackHole = new BlackHole(this.scene, config.blackHole.radius);
    this.accretionDisk = new AccretionDisk(this.scene, this.blackHole, config.disk);
    this.starfield = new Starfield(this.scene, config.rendering.starfieldDensity);

    // Lighting
    this.setupLighting();

    // Camera controller
    this.cameraController = new CameraController(
      this.camera,
      new THREE.Vector3(0, 0, 0),
      this.renderer.domElement,
      config.camera
    );

    // UI controller with callbacks
    this.uiController = new UIController(config, {
      onMassChange: (eventHorizonRadius) => {
        this.blackHole.setRadius(eventHorizonRadius);
        return this.accretionDisk.onBlackHoleRadiusChange(eventHorizonRadius);
      },
      onInnerRadiusChange: (innerRadius) => this.accretionDisk.setInnerRadius(innerRadius),
      onOuterRadiusChange: (outerRadius) => this.accretionDisk.setOuterRadius(outerRadius),
      onRotationSpeedChange: (value) => this.accretionDisk.setRotationSpeed(value),
      onDistanceChange: (value) => this.cameraController.setDistance(value),
      onGlowChange: (value) => this.updateGlowIntensity(value),
      getDiskRadiusState: () => this.accretionDisk.getRadiusState()
    });

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    // Ambient light for minimal base illumination
    const ambientLight = new THREE.AmbientLight(0x001122, 0.3);
    this.scene.add(ambientLight);

    // Point light at black hole center (represents energy from accretion)
    const centerLight = new THREE.PointLight(0x00ffcc, 2, 100);
    centerLight.position.set(0, 0, 0);
    this.scene.add(centerLight);

    // Hemisphere light for subtle atmosphere
    const hemiLight = new THREE.HemisphereLight(0x0033ff, 0x000033, 0.5);
    this.scene.add(hemiLight);

    // Directional light from above (simulates distant light source)
    const dirLight = new THREE.DirectionalLight(0x004466, 0.8);
    dirLight.position.set(0, 50, 0);
    this.scene.add(dirLight);
  }

  updateGlowIntensity(value) {
    config.rendering.glowIntensity = value;
    this.accretionDisk.setOpacity(0.6 + value * 0.2);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update all systems
    this.blackHole.update(deltaTime);
    this.accretionDisk.update(deltaTime);
    this.starfield.update(deltaTime);
    this.cameraController.update(deltaTime);

    // Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Start the simulation
new BlackHoleSimulation();
