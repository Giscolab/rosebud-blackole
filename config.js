// Physics and rendering configuration for black hole simulation

export const config = {
  // Black hole physics
  blackHole: {
    mass: 1.0,              // Schwarzschild mass (M)
    radius: 2.0,            // Event horizon radius (2M for Schwarzschild)
    minRadius: 0.5,
    maxRadius: 5.0
  },

  // Accretion disk parameters
  disk: {
    innerRadius: 3.0,       // Inner edge (ISCO ~3M for Schwarzschild)
    outerRadius: 12.0,      // Outer edge
    thickness: 0.3,         // Vertical thickness
    particleCount: 8000,    // Number of particles in disk
    rotationSpeed: 1.0,     // Angular velocity multiplier
    temperature: 1.0        // Color temperature (affects emission color)
  },

  // Camera settings
  camera: {
    distance: 25.0,         // Distance from black hole
    minDistance: 8.0,
    maxDistance: 80.0,
    fov: 60,
    orbitSpeed: 0.3,        // Mouse sensitivity
    autoRotate: false,
    autoRotateSpeed: 0.1
  },

  // Rendering
  rendering: {
    bloomStrength: 1.5,
    glowIntensity: 2.0,
    diskOpacity: 0.8,
    starfieldDensity: 2000,
    fogDensity: 0.015
  },

  // RK4 Geodesic ray tracing (simplified simulation)
  rayTracing: {
    enabled: true,
    maxSteps: 100,
    stepSize: 0.05,
    bendingStrength: 1.0    // Gravitational lensing strength
  }
};

// Color palette for disk temperature gradient
export const diskColors = {
  hot: 0x00ffff,    // Cyan-white (hottest, inner regions)
  warm: 0x00ccff,   // Bright blue
  cool: 0x0066ff,   // Deep blue
  cold: 0x0033aa    // Dark blue (coolest, outer regions)
};
