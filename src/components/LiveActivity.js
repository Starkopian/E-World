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

}
