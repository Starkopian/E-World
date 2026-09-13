import { creators } from '../data/creators.js';
import { soundManager } from '../audio/soundManager.js';

export function initCreatorSpotlight() {
  const container = document.getElementById('creators-grid');
  const applyBtn = document.getElementById('apply-creator-btn');

  if (container) {
    container.innerHTML = creators.map((c) => `
      <div class="glass-card creator-card tilt-card" data-id="${c.id}">
        <div class="creator-avatar-stage">
          <div class="creator-avatar-circle" style="background: ${c.avatarGradient};">
            ${c.initials}
          </div>
          <div class="creator-badge-orbit">VERIFIED</div>
        </div>

        <h3 class="creator-name">${c.name}</h3>
        <div class="creator-role">${c.role}</div>
        <div class="creator-subs">✦ ${c.subscribers} Citizens • ${c.platform}</div>

        <p class="creator-quote">${c.featuredQuote}</p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-bottom: 1.75rem;">
          ${c.specialties.map((s) => `
            <span style="font-family: var(--font-mono); font-size: 0.7rem; padding: 0.25rem 0.65rem; border-radius: 6px; background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.08);">
              ${s}
            </span>
          `).join('')}
        </div>

        <button class="btn btn-secondary view-creator-btn" data-id="${c.id}" style="width: 100%; font-size: 0.85rem; padding: 0.7rem;">
          View Creator Dossier
        </button>
      </div>
    `).join('');

    const creatorBtns = container.querySelectorAll('.view-creator-btn');
    creatorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const creatorId = btn.dataset.id;
        const creator = creators.find((x) => x.id === creatorId);
        if (creator) openCreatorModal(creator);
      });
    });
  }

  function openCreatorModal(c) {
    const modal = document.getElementById('general-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = `${c.name} - Creator Dossier`;
      modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 90px; height: 90px; border-radius: 50%; background: ${c.avatarGradient}; display: flex; align-items: center; justify-content: center; font-family: var(--font-logo); font-size: 2rem; color: #fff; margin: 0 auto 1rem; border: 2px solid rgba(255,255,255,0.3);">
            ${c.initials}
          </div>
          <h3 style="font-size: 1.6rem; margin-bottom: 0.25rem;">${c.name}</h3>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--cyan-primary); margin-bottom: 1rem;">${c.tag} • ${c.badge}</div>
          <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem; text-align: left;">
            ${c.featuredQuote}
          </p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--chrome-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; text-align: left; font-family: var(--font-mono); font-size: 0.85rem;">
            <div><strong>Streaming Platform:</strong> ${c.platform}</div>
            <div><strong>Subscriber Reach:</strong> ${c.subscribers}</div>
            <div><strong>Focus Areas:</strong> ${c.specialties.join(', ')}</div>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="${c.links.youtube}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.6rem 1.2rem;">Watch Channel</a>
            <button class="btn btn-primary close-modal-btn" style="font-size: 0.85rem; padding: 0.6rem 1.2rem;">Close</button>
          </div>
        </div>
      `;
      modal.classList.add('active');
      soundManager.playSuccess();

      const closeBtn = modalBody.querySelector('.close-modal-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
  }

  // Apply for Creator Profile
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const modal = document.getElementById('general-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalBody = document.getElementById('modal-body');

      if (modal && modalTitle && modalBody) {
        modalTitle.textContent = 'Apply for Creator Verification';
        modalBody.innerHTML = `
          <div>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
              Are you a streamer or video creator in Minecraft SMP, FiveM RP, or esports? Join the <strong>E-World Creator Partnership Program</strong> to receive customized server perms, priority event access, viewer giveaway keys, and promotion on the main site.
            </p>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
              <input type="text" placeholder="Creator / Channel Name" style="background: rgba(255,255,255,0.05); border: 1px solid var(--chrome-border); border-radius: 10px; padding: 0.85rem 1rem; color: #fff; font-family: var(--font-body);" />
              <input type="text" placeholder="Channel Link (YouTube / Twitch)" style="background: rgba(255,255,255,0.05); border: 1px solid var(--chrome-border); border-radius: 10px; padding: 0.85rem 1rem; color: #fff; font-family: var(--font-body);" />
              <input type="text" placeholder="Discord Username (e.g. username#0000)" style="background: rgba(255,255,255,0.05); border: 1px solid var(--chrome-border); border-radius: 10px; padding: 0.85rem 1rem; color: #fff; font-family: var(--font-body);" />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 1rem;">
              <button class="btn btn-secondary close-modal-btn" style="padding: 0.6rem 1.4rem;">Cancel</button>
              <button class="btn btn-primary submit-app-btn" style="padding: 0.6rem 1.4rem;">Submit Application</button>
            </div>
          </div>
        `;
        modal.classList.add('active');
        soundManager.playSuccess();

        const closeBtn = modalBody.querySelector('.close-modal-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

        const submitBtn = modalBody.querySelector('.submit-app-btn');
        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            modalTitle.textContent = 'Application Received!';
            modalBody.innerHTML = `
              <div style="text-align: center; padding: 1.5rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Transmission Dispatched</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                  Our community talent directors will review your stream history and reach out via Discord within 48 hours.
                </p>
                <button class="btn btn-primary finish-modal-btn">Return to Universe</button>
              </div>
            `;
            const finishBtn = modalBody.querySelector('.finish-modal-btn');
            if (finishBtn) finishBtn.addEventListener('click', () => modal.classList.remove('active'));
          });
        }
      }
    });
  }
}
