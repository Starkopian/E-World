import { SceneManager } from './webgl/SceneManager.js';
import { initLiquidCursor } from './components/LiquidCursor.js';
import { initHUD } from './components/HUD.js';
import { initUniverseFlow } from './components/UniverseFlow.js';
import { initIndexMatrix } from './components/IndexMatrix.js';
import { initLiquidDetailModal } from './components/LiquidDetailModal.js';
import { soundManager } from './audio/soundManager.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize WebGL 3D Canvas Scene
  const canvasContainer = document.getElementById('webgl-canvas-container');
  let sceneManager = null;
  if (canvasContainer) {
    sceneManager = new SceneManager(canvasContainer);
    sceneManager.start();
  }

  // 2. Initialize Liquid Magnetic Cursor
  initLiquidCursor();

  // 3. Initialize Liquid Detail Modal
  const { openDetail } = initLiquidDetailModal();

  // 4. Mode Switch Handlers (Universe 3D vs Index Matrix)
  const universeViewport = document.getElementById('universe-viewport');
  const matrixViewport = document.getElementById('matrix-viewport');

  function handleModeToggle(mode) {
    if (mode === 'universe') {
      matrixViewport.classList.remove('active');
      universeViewport.classList.remove('hidden');
    } else {
      universeViewport.classList.add('hidden');
      matrixViewport.classList.add('active');
    }
  }

  // 5. Initialize HUD Framing, Live UTC Clock & Audio Spectrum
  let universeFlow = null;
  const hud = initHUD(
    (targetSceneIndex) => {
      if (universeFlow) {
        universeFlow.goToScene(targetSceneIndex);
      }
    },
    handleModeToggle
  );

  // 6. Initialize Spatial 3D Universe Flow
  universeFlow = initUniverseFlow(sceneManager, hud, (item) => {
    openDetail(item);
  });

  // 7. Initialize Technical Index Matrix
  initIndexMatrix((item) => {
    openDetail(item);
  });

  // Auto-init audio on first user gesture
  window.addEventListener('click', () => {
    soundManager.ensureContext();
  }, { once: true });
});
