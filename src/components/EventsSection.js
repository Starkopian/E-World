import { upcomingEvents } from '../data/events.js';
import { soundManager } from '../audio/soundManager.js';

export function initEventsSection() {
  // 1. Live Countdown Timer for Featured Event (CODM Championship)
  const featured = upcomingEvents.find(event => event.featured);
  const targetDate = new Date(featured.startsAt);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = Math.max(0, targetDate.getTime() - now);

    if (distance === 0) document.getElementById('countdown-status').textContent = 'Sample start date has passed. Await confirmed schedule.';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('count-days');
    const hEl = document.getElementById('count-hours');
    const mEl = document.getElementById('count-minutes');
    const sEl = document.getElementById('count-seconds');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 2. Events Grid Rendering & Category Filtering
  const container = document.getElementById('events-cards-grid');
  const tabs = document.querySelectorAll('.event-tab-btn');

  function renderEvents(filter = 'all') {
    if (!container) return;

    const filtered = filter === 'all'
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.category === filter);

    container.innerHTML = filtered.map((ev) => {
      let badgeClass = 'badge-live';
      if (ev.category === 'minecraft') badgeClass = 'badge-smp';
      if (ev.category === 'rp') badgeClass = 'badge-rp';
      if (ev.category === 'giveaway') badgeClass = 'badge-gold';

      return `
        <div class="glass-card event-card tilt-card" data-id="${ev.id}">
          <div>
            <div class="event-card-header">
              <span class="badge ${badgeClass}">${ev.categoryLabel}</span>
              <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-secondary); border: 1px solid var(--chrome-border);">
                DEMO
              </span>
            </div>
            <h3 class="event-card-title">${ev.title}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">${ev.subtitle}</p>

            <div class="event-card-details">
              <div>📅 <strong>Date:</strong> ${ev.date}</div>
              <div>⏰ <strong>Time:</strong> ${ev.time}</div>
              <div>🏆 <strong>Prize:</strong> <span style="color: var(--cyan-primary);">${ev.prizePool}</span></div>
              <div>👥 <strong>Slots:</strong> ${ev.slots}</div>
            </div>
          </div>

          <button class="btn btn-secondary view-event-btn" data-id="${ev.id}" style="width: 100%; padding: 0.75rem;">
            View Protocol & Rules
          </button>
        </div>
      `;
    }).join('');

    // Attach click modal to event cards
    const viewButtons = container.querySelectorAll('.view-event-btn');
    viewButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const eventId = btn.dataset.id;
        const eventData = upcomingEvents.find((x) => x.id === eventId);
        if (eventData) openEventModal(eventData);
      });
    });
  }

  function openEventModal(ev) {
    const modal = document.getElementById('general-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = ev.title;
      modalBody.innerHTML = `
        <div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <span class="badge badge-live">${ev.categoryLabel}</span>
            <span class="badge badge-gold">Prize: ${ev.prizePool}</span>
          </div>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
            ${ev.description}
          </p>
          <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: #ffffff;">Tournament / Event Rules:</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 2rem; color: var(--text-secondary); line-height: 1.6; font-size: 0.9rem;">
            ${ev.rules.map((r) => `<li>${r}</li>`).join('')}
          </ul>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <a href="#discord-cta" class="btn btn-primary register-cta-btn">Check Announcements in Discord</a>
          </div>
        </div>
      `;
      modal.classList.add('active');
      soundManager.playSuccess();

      const regBtn = modalBody.querySelector('.register-cta-btn');
      if (regBtn) {
        regBtn.addEventListener('click', () => modal.classList.remove('active'));
      }
    }
  }

  // Tabs click
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      soundManager.playClick();
      renderEvents(tab.dataset.category);
    });
  });

  document.getElementById('featured-rules-btn')?.addEventListener('click', (event) => { event.preventDefault(); openEventModal(featured); });
  renderEvents('all');
}
