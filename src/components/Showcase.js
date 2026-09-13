import { soundManager } from '../audio/soundManager.js';

export function initShowcase() {
  // 1. Intersection Observer for Counter Animations
  const counters = document.querySelectorAll('.counter-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.dataset.target, 10);
        const prefix = entry.dataset.prefix || '';
        const suffix = entry.dataset.suffix || '';
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Ease out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);

          entry.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(entry);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((c) => observer.observe(c));

  // 2. Click inspect for showcase cards
  const cards = document.querySelectorAll('.showcase-card');
  const modal = document.getElementById('general-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h4')?.textContent || 'Showcase Moment';
      const category = card.querySelector('.badge')?.textContent || 'E-WORLD MOMENT';
      const desc = card.querySelector('p')?.textContent || '';
      const bgStyle = card.querySelector('.showcase-img-placeholder')?.style.backgroundImage || '';

      if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = `
          <div>
            <div class="badge badge-live" style="margin-bottom: 1rem;">${category}</div>
            <div style="width: 100%; height: 320px; border-radius: 16px; margin-bottom: 1.5rem; border: 1px solid var(--chrome-border); background-size: cover; background-position: center; ${bgStyle ? `background-image: ${bgStyle}` : 'background: #0d121f'}"></div>
            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 1rem; margin-bottom: 1.5rem;">
              ${desc} Captured live across our interconnected game servers and voice lobbies.
            </p>
            <div style="display: flex; justify-content: flex-end;">
              <button class="btn btn-secondary close-modal-btn" style="padding: 0.6rem 1.4rem;">Close Preview</button>
            </div>
          </div>
        `;
        modal.classList.add('active');
        soundManager.playSuccess();

        const closeBtn = modalBody.querySelector('.close-modal-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
      }
    });
  });
}
