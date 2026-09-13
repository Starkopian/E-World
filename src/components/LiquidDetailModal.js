import { soundManager } from '../audio/soundManager.js';

export function initLiquidDetailModal() {
  const modal = document.getElementById('general-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  function openDetail(item) {
    if (!modal || !modalTitle || !modalBody) return;

    soundManager.playSlideWarp();
    modalTitle.textContent = item.title || item.name || 'Protocol Transmission';

    const desc = item.description || item.bio || item.featuredQuote || item.subtitle || '';
    const category = item.category || item.categoryLabel || item.role || 'E-WORLD REALM';

    modalBody.innerHTML = `
      <div>
        <div style="display: flex; gap: 8px; margin-bottom: 18px; align-items: center;">
          <span class="badge badge-live">${category}</span>
          ${item.coordinates ? `<span class="mono" style="font-size: 11px; color: var(--cyan-primary);">${item.coordinates}</span>` : ''}
          ${item.prizePool ? `<span class="badge badge-gold">Prize: ${item.prizePool}</span>` : ''}
        </div>

        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
          ${desc}
        </p>

        ${item.features ? `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--chrome-border); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">CORE SPECIFICATIONS:</div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 12px;">
              ${item.features.map((f) => `<li style="color: #ffffff;">✦ ${f}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${item.rules ? `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--chrome-border); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">TOURNAMENT PROTOCOLS:</div>
            <ul style="padding-left: 18px; color: var(--text-secondary); font-size: 13px; line-height: 1.6;">
              ${item.rules.map((r) => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="display: flex; gap: 14px; justify-content: flex-end; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
          <button class="btn btn-secondary close-modal-btn" style="padding: 8px 18px; font-size: 12px;">Dismiss</button>
          <a href="https://discord.gg/eworld" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 8px 20px; font-size: 12px;">
            Enter Discord Guild ↗
          </a>
        </div>
      </div>
    `;

    modal.classList.add('active');

    const closeBtn = modalBody.querySelector('.close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        soundManager.playClick();
      });
    }
  }

  return { openDetail };
}
