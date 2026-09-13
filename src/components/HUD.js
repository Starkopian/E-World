import { soundManager } from '../audio/soundManager.js';
import { universeScenes } from '../data/realms.js';

export function initHUD(onSceneSelect, onModeToggle) {
  const clockEl = document.getElementById('hud-live-clock');
  const sceneIndicator = document.getElementById('at-scene-indicator');
  const coordEl = document.getElementById('hud-coord-indicator');
  const soundCluster = document.getElementById('at-audio-toggle');
  const specBars = document.querySelectorAll('.at-spec-bar');
  const modeBtns = document.querySelectorAll('.at-mode-btn');
  const scrubDots = document.querySelectorAll('.at-scrub-dot');

  // 1. Live UTC Clock
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${utcHours}:${utcMins}:${utcSecs} UTC`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 2. Audio Spectrum Visualizer Loop
  function animVisualizer() {
    if (specBars.length > 0) {
      const freqs = soundManager.getFrequencyData();
      specBars.forEach((bar, idx) => {
        const h = freqs[idx] || 4;
        bar.style.height = `${Math.min(14, Math.max(3, h * 1.5))}px`;
      });
    }
    requestAnimationFrame(animVisualizer);
  }
  animVisualizer();

  // Audio Toggle
  if (soundCluster) {
    soundCluster.addEventListener('click', () => {
      soundManager.toggleMute();
      const label = document.getElementById('at-audio-label');
      if (label) {
        label.textContent = soundManager.isMuted() ? 'AUDIO: OFF' : 'AUDIO: ON';
      }
    });
  }

  // 3. Mode Toggle (UNIVERSE vs INDEX)
  let currentMode = 'universe';
  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === currentMode) return;

      modeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = mode;
      soundManager.playClick();

      if (onModeToggle) {
        onModeToggle(mode);
      }
    });
  });

  // 4. Scrub Dots Click
  scrubDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      soundManager.playClick();
      if (onSceneSelect) onSceneSelect(idx);
    });
  });

  // 5. Update Active Scene UI
  function updateSceneHUD(index) {
    const scene = universeScenes[index] || universeScenes[0];
    if (sceneIndicator) {
      sceneIndicator.textContent = `[ ${scene.index} / 07 // ${scene.category} ]`;
    }
    if (coordEl) {
      coordEl.textContent = scene.coordinates;
    }

    scrubDots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  return { updateSceneHUD };
}
