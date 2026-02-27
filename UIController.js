/**
 * UIController - Manages the UI panel and controls
 * Handles real-time parameter adjustments
 */
export class UIController {
  constructor(config, callbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.panel = null;
    this.toggleButton = null;
    this.titleOverlay = null;
    this.isVisible = true;

    this.createUI();
    this.setupEventListeners();
  }

  createUI() {
    // Create UI Panel
    this.panel = document.createElement('div');
    this.panel.className = 'ui-panel';
    this.panel.innerHTML = `
      <h2 class="ui-panel__title">⚫ Black Hole Control</h2>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Black Hole Mass
          <span class="ui-panel__value" data-value="mass">${this.config.blackHole.radius.toFixed(2)}</span>
        </label>
        <input type="range" id="mass-slider" class="ui-panel__slider"
          min="${this.config.blackHole.minRadius}"
          max="${this.config.blackHole.maxRadius}"
          step="0.1"
          value="${this.config.blackHole.radius}">
      </div>

      <div class="ui-panel__divider"></div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Disk Inner Radius
          <span class="ui-panel__value" data-value="inner">${this.config.disk.innerRadius.toFixed(1)}</span>
        </label>
        <input type="range" id="inner-slider" class="ui-panel__slider"
          min="2.5"
          max="8"
          step="0.5"
          value="${this.config.disk.innerRadius}">
      </div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Disk Outer Radius
          <span class="ui-panel__value" data-value="outer">${this.config.disk.outerRadius.toFixed(1)}</span>
        </label>
        <input type="range" id="outer-slider" class="ui-panel__slider"
          min="8"
          max="25"
          step="1"
          value="${this.config.disk.outerRadius}">
      </div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Rotation Speed
          <span class="ui-panel__value" data-value="rotation">${this.config.disk.rotationSpeed.toFixed(2)}×</span>
        </label>
        <input type="range" id="rotation-slider" class="ui-panel__slider"
          min="0.1"
          max="3"
          step="0.1"
          value="${this.config.disk.rotationSpeed}">
      </div>

      <div class="ui-panel__divider"></div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Camera Distance
          <span class="ui-panel__value" data-value="distance">${this.config.camera.distance.toFixed(1)}</span>
        </label>
        <input type="range" id="distance-slider" class="ui-panel__slider"
          min="${this.config.camera.minDistance}"
          max="${this.config.camera.maxDistance}"
          step="1"
          value="${this.config.camera.distance}">
      </div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Glow Intensity
          <span class="ui-panel__value" data-value="glow">${this.config.rendering.glowIntensity.toFixed(1)}</span>
        </label>
        <input type="range" id="glow-slider" class="ui-panel__slider"
          min="0.5"
          max="4"
          step="0.1"
          value="${this.config.rendering.glowIntensity}">
      </div>

      <div class="ui-panel__info">
        🖱️ Drag to orbit • 🎡 Scroll to zoom<br>
        ⌨️ WASD / Arrows to move • Q/E for height<br>
        ␣ Space to toggle auto-rotate
      </div>
    `;

    document.body.appendChild(this.panel);

    // Create toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'ui-toggle';
    this.toggleButton.textContent = 'Hide UI';
    this.toggleButton.addEventListener('click', () => this.toggleUI());
    document.body.appendChild(this.toggleButton);

    // Create title overlay
    this.titleOverlay = document.createElement('div');
    this.titleOverlay.className = 'title-overlay';
    this.titleOverlay.innerHTML = `
      <h1 class="title-overlay__title">Accretion Disk</h1>
      <p class="title-overlay__subtitle">Relativistic Visualization</p>
    `;
    document.body.appendChild(this.titleOverlay);
  }

  getValueElement(key) {
    return this.panel?.querySelector(`[data-value="${key}"]`);
  }

  setupEventListeners() {
    // Black hole mass
    const massSlider = document.getElementById('mass-slider');
    const massValue = this.getValueElement('mass');
    massSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      massValue.textContent = value.toFixed(2);
      this.callbacks.onMassChange?.(value);
    });

    // Disk inner radius
    const innerSlider = document.getElementById('inner-slider');
    const innerValue = this.getValueElement('inner');
    innerSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      innerValue.textContent = value.toFixed(1);
      this.callbacks.onInnerRadiusChange?.(value);
    });

    // Disk outer radius
    const outerSlider = document.getElementById('outer-slider');
    const outerValue = this.getValueElement('outer');
    outerSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      outerValue.textContent = value.toFixed(1);
      this.callbacks.onOuterRadiusChange?.(value);
    });

    // Rotation speed
    const rotationSlider = document.getElementById('rotation-slider');
    const rotationValue = this.getValueElement('rotation');
    rotationSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      rotationValue.textContent = value.toFixed(2) + '×';
      this.callbacks.onRotationSpeedChange?.(value);
    });

    // Camera distance
    const distanceSlider = document.getElementById('distance-slider');
    const distanceValue = this.getValueElement('distance');
    distanceSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      distanceValue.textContent = value.toFixed(1);
      this.callbacks.onDistanceChange?.(value);
    });

    // Glow intensity
    const glowSlider = document.getElementById('glow-slider');
    const glowValue = this.getValueElement('glow');
    glowSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      glowValue.textContent = value.toFixed(1);
      this.callbacks.onGlowChange?.(value);
    });
  }

  toggleUI() {
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      this.panel.classList.remove('ui-hidden');
      this.titleOverlay.classList.remove('ui-hidden');
      this.toggleButton.textContent = 'Hide UI';
    } else {
      this.panel.classList.add('ui-hidden');
      this.titleOverlay.classList.add('ui-hidden');
      this.toggleButton.textContent = 'Show UI';
    }
  }

  updateValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }
}
