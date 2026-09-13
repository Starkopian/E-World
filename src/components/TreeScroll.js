import { universeScenes } from '../data/realms.js';
import { soundManager } from '../audio/soundManager.js';

export function initTreeScroll(sceneManager, hud, onOpenDetail) {
  const container = document.getElementById('tree-nodes-container');
  const progressBar = document.getElementById('tree-trunk-progress');
  if (!container) return;

  // Node alignment map: root, left, right, center, left, right, center
  const alignment = ['root', 'left', 'right', 'center', 'left', 'right', 'center'];

  // Render tree branch nodes
  container.innerHTML = universeScenes.map((scene, idx) => {
    const align = alignment[idx] || 'center';
    return `
      <div class="tree-node tree-node-${align}" data-index="${idx}" id="tree-node-${scene.id}">
        <!-- Central Bud Junction Marker -->
        <div class="tree-junction-marker" data-index="${idx}">
          <div class="tree-junction-core"></div>
        </div>

        <!-- Connecting Branch Arm -->
        <div class="tree-branch-arm"></div>

        <!-- Realm Branch Content Card -->
        <div class="tree-card-box tilt-card">
          <div class="tree-node-eyebrow">
            <span class="pulse-dot pulse-dot-${scene.theme === 'emerald' ? 'green' : 'cyan'}"></span>
            <span>BRANCH // ${scene.category}</span>
          </div>

          <h2 class="tree-node-title text-gradient-${scene.theme}">${scene.title}</h2>
          <div class="tree-node-subtitle">${scene.subtitle}</div>
          <p class="tree-node-desc">${scene.description}</p>

          <div class="tree-telemetry-cluster">
            ${Object.entries(scene.stats).map(([k, v]) => `
              <div class="tree-telemetry-item">
                <span>${k.toUpperCase()}:</span> <strong>${v}</strong>
              </div>
            `).join('')}
          </div>

          <div class="tree-card-actions">
            <button class="btn btn-primary magnetic btn-inspect-tree" data-id="${scene.id}">
              ENTER PROTOCOL [DETAILS] ↗
            </button>
            <a href="https://discord.gg/eworld" target="_blank" rel="noopener" class="btn btn-secondary magnetic">
              DISCORD GATEWAY
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach Detail inspection click
  const inspectBtns = container.querySelectorAll('.btn-inspect-tree');
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

  // Scroll Tracking for Tree Growth & 3D Camera Descent
  const nodes = container.querySelectorAll('.tree-node');
  let lastActiveIdx = -1;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / (docHeight || 1)));

    // Grow central energy trunk line
    if (progressBar) {
      progressBar.style.height = `${progress * 100}%`;
    }

    // Sync WebGL 3D camera
    if (sceneManager) {
      sceneManager.setTreeScrollProgress(progress);
    }

    // Determine currently focused tree node
    const viewCenter = window.innerHeight * 0.45;
    let activeIdx = 0;

    nodes.forEach((node, idx) => {
      const rect = node.getBoundingClientRect();
      if (rect.top <= viewCenter && rect.bottom >= viewCenter) {
        activeIdx = idx;
      }
    });

    if (activeIdx !== lastActiveIdx) {
      nodes.forEach((n, idx) => {
        if (idx === activeIdx) {
          n.classList.add('active');
        } else {
          n.classList.remove('active');
        }
      });

      lastActiveIdx = activeIdx;
      if (hud) {
        hud.updateSceneHUD(activeIdx);
      }
      soundManager.playSlideWarp();
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll to node when HUD scrub dot clicked
  function scrollToNode(idx) {
    const targetNode = nodes[idx];
    if (targetNode) {
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return { scrollToNode };
}
