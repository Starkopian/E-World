import { liveStats } from '../data/stats.js';

export function initLiveActivity() {
  const tickerContainer = document.getElementById('live-ticker-content');
  if (!tickerContainer) return;

  // Populate ticker items
  const feed = [...liveStats.activityFeed, ...liveStats.activityFeed]; // Duplicate for seamless infinite loop
  tickerContainer.innerHTML = feed.map((item) => {
    let tagBadge = 'badge-live';
    if (item.type === 'smp') tagBadge = 'badge-smp';
    if (item.type === 'rp') tagBadge = 'badge-rp';
    if (item.type === 'event') tagBadge = 'badge-gold';

    return `
      <div class="ticker-item">
        <span class="badge ${tagBadge}">${item.type.toUpperCase()}</span>
        <span>${item.text}</span>
        <span style="color: var(--text-muted); font-size: 0.75rem;">• ${item.time}</span>
      </div>
    `;
  }).join('');

  // Subtle real-time player count fluctuations (±1 or 2) to simulate active heartbeat
  setInterval(() => {
    const smpEl = document.getElementById('smp-online-count');
    const rpEl = document.getElementById('rp-online-count');
    const discordOnlineEl = document.getElementById('discord-online-count');

    if (smpEl) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
      const current = parseInt(smpEl.dataset.val || '82', 10);
      const next = Math.max(75, Math.min(95, current + delta));
      smpEl.dataset.val = next;
      smpEl.textContent = next;
    }

    if (rpEl) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
      const current = parseInt(rpEl.dataset.val || '126', 10);
      const next = Math.max(118, Math.min(140, current + delta));
      rpEl.dataset.val = next;
      rpEl.textContent = next;
    }

    if (discordOnlineEl) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5);
      const current = parseInt(discordOnlineEl.dataset.val || '2381', 10);
      const next = Math.max(2300, Math.min(2450, current + delta));
      discordOnlineEl.dataset.val = next;
      discordOnlineEl.textContent = next.toLocaleString();
    }
  }, 4000);
}
