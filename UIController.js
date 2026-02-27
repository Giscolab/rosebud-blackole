/**
 * UIController - Manages the UI panel and controls
 * Handles real-time parameter adjustments
 */
export class UIController {
  /**
   * API publique: initialise l'UI et branche les callbacks métier.
   * @param {object} config
   * @param {object} callbacks
   */
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
          Black Hole Radius (Event Horizon)
          <span class="ui-panel__value" id="event-horizon-radius-value" data-value="eventHorizonRadius">${this.config.blackHole.radius.toFixed(2)}</span>
        </label>
        <input type="range" id="event-horizon-radius-slider" class="ui-panel__slider"
          min="${this.config.blackHole.minRadius}"
          max="${this.config.blackHole.maxRadius}"
          step="0.1"
          value="${this.config.blackHole.radius}">
      </div>

      <div class="ui-panel__divider"></div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Disk Inner Radius
          <span class="ui-panel__value" id="inner-value" data-value="inner">${this.config.disk.innerRadius.toFixed(1)}</span>
        </label>
        <input type="range" id="inner-slider" class="ui-panel__slider"
          min="${this.config.disk.minInnerRadius}"
          max="${this.config.disk.maxInnerRadius}"
          step="0.5"
          value="${this.config.disk.innerRadius}">
      </div>

      <div class="ui-panel__group">
        <label class="ui-panel__label">
          Disk Outer Radius
          <span class="ui-panel__value" id="outer-value" data-value="outer">${this.config.disk.outerRadius.toFixed(1)}</span>
        </label>
        <input type="range" id="outer-slider" class="ui-panel__slider"
          min="${this.config.disk.minOuterRadius}"
          max="${this.config.disk.maxOuterRadius}"
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
    // Black hole event horizon radius
    const eventHorizonRadiusSlider = document.getElementById('event-horizon-radius-slider');
    const eventHorizonRadiusValue = this.getValueElement('eventHorizonRadius');
    eventHorizonRadiusSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      eventHorizonRadiusValue.textContent = value.toFixed(2);
      this.callbacks.onMassChange?.(value);
      this.applyDiskRadiusState(this.callbacks.getDiskRadiusState?.());
    });

    // Disk inner radius
    const innerSlider = document.getElementById('inner-slider');
    const innerValue = this.getValueElement('inner');
    innerSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      innerValue.textContent = value.toFixed(1);
      const state = this.callbacks.onInnerRadiusChange?.(value);
      this.applyDiskRadiusState(state || this.callbacks.getDiskRadiusState?.());
    });

    // Disk outer radius
    const outerSlider = document.getElementById('outer-slider');
    const outerValue = this.getValueElement('outer');
    outerSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      outerValue.textContent = value.toFixed(1);
      const state = this.callbacks.onOuterRadiusChange?.(value);
      this.applyDiskRadiusState(state || this.callbacks.getDiskRadiusState?.());
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

    this.applyDiskRadiusState(this.callbacks.getDiskRadiusState?.());

    // Glow intensity
    const glowSlider = document.getElementById('glow-slider');
    const glowValue = this.getValueElement('glow');
    glowSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      glowValue.textContent = value.toFixed(1);
      this.callbacks.onGlowChange?.(value);
    });
  }

  applyDiskRadiusState(state) {
    if (!state) return;

    const innerSlider = document.getElementById('inner-slider');
    const outerSlider = document.getElementById('outer-slider');
    const innerValue = this.getValueElement('inner');
    const outerValue = this.getValueElement('outer');

    if (innerSlider && typeof state.innerRadius === 'number') {
      innerSlider.value = state.innerRadius;
      innerSlider.min = state.innerMin;
      innerSlider.max = state.innerMax;
      if (innerValue) innerValue.textContent = state.innerRadius.toFixed(1);
    }

    if (outerSlider && typeof state.outerRadius === 'number') {
      outerSlider.value = state.outerRadius;
      outerSlider.min = state.outerMin;
      outerSlider.max = state.outerMax;
      if (outerValue) outerValue.textContent = state.outerRadius.toFixed(1);
    }
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
