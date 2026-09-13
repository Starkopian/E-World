import { soundManager } from '../audio/soundManager.js';

export function initChooseYourWorld() {
  const container = document.querySelector('.portals-split-container');
  const smpHalf = document.querySelector('.portal-smp');
  const rpHalf = document.querySelector('.portal-rp');

  if (!container || !smpHalf || !rpHalf) return;

  // Diagonal Split Expansion on Hover
  smpHalf.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) {
      container.style.gridTemplateColumns = '1.35fr 0.65fr';
    }
    soundManager.playPortal();
  });

  rpHalf.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) {
      container.style.gridTemplateColumns = '0.65fr 1.35fr';
    }
    soundManager.playPortal();
  });

  container.addEventListener('mouseleave', () => {
    if (window.innerWidth > 900) {
      container.style.gridTemplateColumns = '1fr 1fr';
    }
  });

  // Modal / Portal Feedback on Button Click
  const smpBtn = document.getElementById('btn-enter-smp');
  const rpBtn = document.getElementById('btn-enter-rp');

  function showPortalNotification(worldName, game, details) {
    const modal = document.getElementById('general-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = `${worldName} - Realm Portal`;
      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div class="badge ${worldName.includes('SMP') ? 'badge-smp' : 'badge-rp'}" style="margin-bottom: 1rem;">
            SYSTEM PROTOCOL: IN DEVELOPMENT
          </div>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            The dimensional gateway to <strong>${worldName}</strong> (${game}) is currently undergoing final stress testing and alpha shader synchronization.
          </p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--chrome-border); border-radius: 12px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem;">
            ${details}
          </div>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="#discord-cta" class="btn btn-primary close-modal-trigger" style="font-size: 0.85rem; padding: 0.6rem 1.4rem;">Get Early Alpha Access on Discord</a>
        </div>
      `;
      modal.classList.add('active');
      soundManager.playSuccess();

      const closeTrigger = modalBody.querySelector('.close-modal-trigger');
      if (closeTrigger) {
        closeTrigger.addEventListener('click', () => {
          modal.classList.remove('active');
        });
      }
    }
  }

  if (smpBtn) {
    smpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalNotification(
        'E-World SMP',
        'Minecraft Java 1.21',
        '<div><strong>Expected Gateway:</strong> Q3 2026</div><div><strong>Features:</strong> Custom World Gen • Lore Bosses • Dynmap • Anti-Grief</div>'
      );
    });
  }

  if (rpBtn) {
    rpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPortalNotification(
        'E-World RP',
        'FiveM GTA V',
        '<div><strong>Expected Gateway:</strong> Q4 2026</div><div><strong>Features:</strong> Custom Economy • Real Estate • Custom Vehicles • Strict RP</div>'
      );
    });
  }
}
