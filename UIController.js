/**
 * UIController - Manages the UI panel and controls
 * Handles real-time parameter adjustments
 */
export class UIController {
  constructor(config, callbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.panel = null;
    this.isVisible = true;
    
    this.createUI();
    this.setupEventListeners();
  }

  createUI() {
    // Create UI Panel
    this.panel = document.createElement('div');
    this.panel.id = 'ui-panel';
    this.panel.innerHTML = `
      <h2>⚫ Black Hole Control</h2>
      
      <div class="control-group">
        <label>
          Black Hole Mass
          <span class="value-display" id="mass-value">${this.config.blackHole.radius.toFixed(2)}</span>
        </label>
        <input type="range" id="mass-slider" 
          min="${this.config.blackHole.minRadius}" 
          max="${this.config.blackHole.maxRadius}" 
          step="0.1" 
          value="${this.config.blackHole.radius}">
      </div>

      <div class="section-divider"></div>

      <div class="control-group">
        <label>
          Disk Inner Radius
          <span class="value-display" id="inner-value">${this.config.disk.innerRadius.toFixed(1)}</span>
        </label>
        <input type="range" id="inner-slider" 
          min="2.5" 
          max="8" 
          step="0.5" 
          value="${this.config.disk.innerRadius}">
      </div>

      <div class="control-group">
        <label>
          Disk Outer Radius
          <span class="value-display" id="outer-value">${this.config.disk.outerRadius.toFixed(1)}</span>
        </label>
        <input type="range" id="outer-slider" 
          min="8" 
          max="25" 
          step="1" 
          value="${this.config.disk.outerRadius}">
      </div>

      <div class="control-group">
        <label>
          Rotation Speed
          <span class="value-display" id="rotation-value">${this.config.disk.rotationSpeed.toFixed(2)}×</span>
        </label>
        <input type="range" id="rotation-slider" 
          min="0.1" 
          max="3" 
          step="0.1" 
          value="${this.config.disk.rotationSpeed}">
      </div>

      <div class="section-divider"></div>

      <div class="control-group">
        <label>
          Camera Distance
          <span class="value-display" id="distance-value">${this.config.camera.distance.toFixed(1)}</span>
        </label>
        <input type="range" id="distance-slider" 
          min="${this.config.camera.minDistance}" 
          max="${this.config.camera.maxDistance}" 
          step="1" 
          value="${this.config.camera.distance}">
      </div>

      <div class="control-group">
        <label>
          Glow Intensity
          <span class="value-display" id="glow-value">${this.config.rendering.glowIntensity.toFixed(1)}</span>
        </label>
        <input type="range" id="glow-slider" 
          min="0.5" 
          max="4" 
          step="0.1" 
          value="${this.config.rendering.glowIntensity}">
      </div>

      <div class="info-text">
        🖱️ Drag to orbit • 🎡 Scroll to zoom<br>
        ⌨️ WASD / Arrows to move • Q/E for height<br>
        ␣ Space to toggle auto-rotate
      </div>
    `;

    document.body.appendChild(this.panel);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toggle-ui';
    toggleBtn.textContent = 'Hide UI';
    toggleBtn.addEventListener('click', () => this.toggleUI());
    document.body.appendChild(toggleBtn);

    // Create title overlay
    const titleOverlay = document.createElement('div');
    titleOverlay.id = 'title-overlay';
    titleOverlay.innerHTML = `
      <h1>Accretion Disk</h1>
      <p>Relativistic Visualization</p>
    `;
    document.body.appendChild(titleOverlay);
  }

  setupEventListeners() {
    // Black hole mass
    const massSlider = document.getElementById('mass-slider');
    const massValue = document.getElementById('mass-value');
    massSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      massValue.textContent = value.toFixed(2);
      this.callbacks.onMassChange?.(value);
    });

    // Disk inner radius
    const innerSlider = document.getElementById('inner-slider');
    const innerValue = document.getElementById('inner-value');
    innerSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      innerValue.textContent = value.toFixed(1);
      this.callbacks.onInnerRadiusChange?.(value);
    });

    // Disk outer radius
    const outerSlider = document.getElementById('outer-slider');
    const outerValue = document.getElementById('outer-value');
    outerSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      outerValue.textContent = value.toFixed(1);
      this.callbacks.onOuterRadiusChange?.(value);
    });

    // Rotation speed
    const rotationSlider = document.getElementById('rotation-slider');
    const rotationValue = document.getElementById('rotation-value');
    rotationSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      rotationValue.textContent = value.toFixed(2) + '×';
      this.callbacks.onRotationSpeedChange?.(value);
    });

    // Camera distance
    const distanceSlider = document.getElementById('distance-slider');
    const distanceValue = document.getElementById('distance-value');
    distanceSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      distanceValue.textContent = value.toFixed(1);
      this.callbacks.onDistanceChange?.(value);
    });

    // Glow intensity
    const glowSlider = document.getElementById('glow-slider');
    const glowValue = document.getElementById('glow-value');
    glowSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      glowValue.textContent = value.toFixed(1);
      this.callbacks.onGlowChange?.(value);
    });
  }

  toggleUI() {
    this.isVisible = !this.isVisible;
    const panel = document.getElementById('ui-panel');
    const toggleBtn = document.getElementById('toggle-ui');
    const titleOverlay = document.getElementById('title-overlay');
    
    if (this.isVisible) {
      panel.classList.remove('ui-hidden');
      titleOverlay.classList.remove('ui-hidden');
      toggleBtn.textContent = 'Hide UI';
    } else {
      panel.classList.add('ui-hidden');
      titleOverlay.classList.add('ui-hidden');
      toggleBtn.textContent = 'Show UI';
    }
  }

  updateValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }
}
