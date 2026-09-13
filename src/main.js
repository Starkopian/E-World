import { SceneManager } from './webgl/SceneManager.js';
import { initLiquidCursor } from './components/LiquidCursor.js';
import { initHUD } from './components/HUD.js';
import { initTreeScroll } from './components/TreeScroll.js';
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

  // 4. Mode Switch Handlers (Tree Scroll vs Index Matrix)
  const treeViewport = document.getElementById('tree-viewport');
  const matrixViewport = document.getElementById('matrix-viewport');

  function handleModeToggle(mode) {
    if (mode === 'tree') {
      matrixViewport.classList.remove('active');
      treeViewport.classList.remove('hidden');
    } else {
      treeViewport.classList.add('hidden');
      matrixViewport.classList.add('active');
    }
  }

  // 5. Initialize HUD Framing, Live UTC Clock & Audio Spectrum
  let treeScroll = null;
  const hud = initHUD(
    (targetIndex) => {
      if (treeScroll) {
        treeScroll.scrollToNode(targetIndex);
      }
    },
    handleModeToggle
  );

  // 6. Initialize Vertical Branching Tree Scroll
  treeScroll = initTreeScroll(sceneManager, hud, (item) => {
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
