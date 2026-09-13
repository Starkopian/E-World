import { universeScenes } from '../data/realms.js';
import { soundManager } from '../audio/soundManager.js';

export function initUniverseFlow(sceneManager, hud, onOpenDetail) {
  const viewport = document.getElementById('universe-viewport');
  const slider = document.getElementById('universe-slider');
  if (!viewport || !slider) return;

  let currentIndex = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let isDown = false;
  let startX = 0;
  let dragDeltaX = 0;

  // Render slides dynamically
  slider.innerHTML = universeScenes.map((scene) => `
    <div class="universe-slide" data-id="${scene.id}">
      <div class="slide-content-wrapper">
        <div class="slide-editorial-left">
          <div class="slide-category-tag">
            <span class="pulse-dot pulse-dot-cyan"></span>
            <span>// ${scene.category}</span>
          </div>
          <h1 class="slide-title-editorial">${scene.title}</h1>
          <div class="slide-subtitle">${scene.subtitle}</div>
          <p class="slide-desc">${scene.description}</p>

          ${scene.features ? `
            <ul class="slide-features">
              ${scene.features.map((f) => `<li>✦ ${f}</li>`).join('')}
            </ul>
          ` : ''}

          <div class="slide-actions">
            <button class="btn btn-primary magnetic btn-inspect-scene" data-id="${scene.id}">
              ENTER PROTOCOL [DETAILS] ↗
            </button>
            <a href="https://discord.gg/eworld" target="_blank" rel="noopener" class="btn btn-secondary magnetic">
              DISCORD ACCESS
            </a>
          </div>
        </div>

        <div class="slide-dossier-card tilt-card">
          <div class="dossier-header">
            <span class="mono" style="color: var(--cyan-primary);">${scene.coordinates}</span>
            <span class="badge badge-live">ONLINE</span>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">TELEMETRY STATS</div>
            ${Object.entries(scene.stats).map(([k, v]) => `
              <div class="dossier-stat-row">
                <span class="dossier-stat-label">${k.toUpperCase()}:</span>
                <span class="dossier-stat-val text-gradient-${scene.theme}">${v}</span>
              </div>
            `).join('')}
          </div>

          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
            ✦ DRAG / SCROLL TO TRAVEL TO NEXT REALM
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Attach Detail inspection click
  const inspectBtns = slider.querySelectorAll('.btn-inspect-scene');
  inspectBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sceneId = btn.dataset.id;
      const scene = universeScenes.find((s) => s.id === sceneId);
      if (scene && onOpenDetail) {
        onOpenDetail(scene);
      }
    });
  });

  // Jump to specific scene
  function goToScene(index) {
    currentIndex = Math.max(0, Math.min(universeScenes.length - 1, index));
    targetProgress = currentIndex;
    hud.updateSceneHUD(currentIndex);
    soundManager.playSlideWarp();
  }

  // Mouse drag & gesture navigation
  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.clientX;
    dragDeltaX = 0;
    viewport.classList.add('grabbing');
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    viewport.classList.remove('grabbing');

    if (Math.abs(dragDeltaX) > 70) {
      if (dragDeltaX < 0 && currentIndex < universeScenes.length - 1) {
        goToScene(currentIndex + 1);
      } else if (dragDeltaX > 0 && currentIndex > 0) {
        goToScene(currentIndex - 1);
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    dragDeltaX = e.clientX - startX;
  });

  // Wheel scrub
  let wheelTimeout;
  window.addEventListener('wheel', (e) => {
    if (document.getElementById('matrix-viewport')?.classList.contains('active')) return;
    if (wheelTimeout) return;

    if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
      const dir = (e.deltaY > 0 || e.deltaX > 0) ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(universeScenes.length - 1, currentIndex + dir));
      if (nextIndex !== currentIndex) {
        goToScene(nextIndex);
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 500);
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goToScene(currentIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goToScene(currentIndex - 1);
    }
  });

  // Smooth animation loop for spatial slider and WebGL camera
  function updateSlider() {
    currentProgress += (targetProgress - currentProgress) * 0.08;
    slider.style.transform = `translateX(-${currentProgress * 100}vw)`;

    if (sceneManager) {
      sceneManager.setSpatialProgress(currentProgress);
    }

    requestAnimationFrame(updateSlider);
  }
  updateSlider();

  return { goToScene };
}
