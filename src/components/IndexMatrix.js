import { universeScenes } from '../data/realms.js';
import { upcomingEvents } from '../data/events.js';
import { creators } from '../data/creators.js';
import { teamMembers } from '../data/team.js';
import { soundManager } from '../audio/soundManager.js';

export function initIndexMatrix(onOpenDetail) {
  const container = document.getElementById('matrix-table-body');
  const searchInput = document.getElementById('matrix-search-input');
  const filterChips = document.querySelectorAll('.matrix-filter-chip');

  if (!container) return;

  // Build unified index entries
  const allEntries = [
    ...universeScenes.map((s) => ({
      type: 'realms',
      index: s.index,
      title: s.title,
      category: s.category,
      status: 'ONLINE',
      metrics: s.tagline,
      raw: s
    })),
    ...upcomingEvents.map((e, idx) => ({
      type: 'esports',
      index: `E0${idx + 1}`,
      title: e.title,
      category: e.categoryLabel,
      status: e.status,
      metrics: `${e.date} • ${e.prizePool}`,
      raw: e
    })),
    ...creators.map((c, idx) => ({
      type: 'creators',
      index: `C0${idx + 1}`,
      title: c.name,
      category: 'Verified Partner',
      status: 'ACTIVE',
      metrics: `${c.subscribers} Citizens • ${c.role}`,
      raw: c
    })),
    ...teamMembers.map((m, idx) => ({
      type: 'council',
      index: `T0${idx + 1}`,
      title: m.name,
      category: m.role,
      status: 'COUNCIL',
      metrics: m.discordTag,
      raw: m
    }))
  ];

  let currentCategory = 'all';
  let currentSearch = '';

  function renderTable() {
    const filtered = allEntries.filter((item) => {
      const matchCat = currentCategory === 'all' || item.type === currentCategory;
      const matchSearch = currentSearch === '' ||
        item.title.toLowerCase().includes(currentSearch) ||
        item.category.toLowerCase().includes(currentSearch) ||
        item.metrics.toLowerCase().includes(currentSearch);
      return matchCat && matchSearch;
    });

    container.innerHTML = filtered.map((row) => `
      <tr class="matrix-row" data-type="${row.type}" data-title="${row.title}">
        <td class="matrix-idx">${row.index}</td>
        <td>
          <div class="matrix-title">${row.title}</div>
          <div class="matrix-desc">${row.metrics}</div>
        </td>
        <td class="mono" style="color: var(--text-secondary);">${row.category}</td>
        <td>
          <span class="badge ${row.status === 'ONLINE' ? 'badge-live' : 'badge-gold'}">
            ${row.status}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-inspect-row" style="font-size: 11px; padding: 4px 12px;">
            INSPECT ↗
          </button>
        </td>
      </tr>
    `).join('');

    // Attach inspect events
    const rows = container.querySelectorAll('.matrix-row');
    rows.forEach((tr, i) => {
      tr.addEventListener('click', () => {
        soundManager.playClick();
        if (onOpenDetail && filtered[i]) {
          onOpenDetail(filtered[i].raw);
        }
      });
    });
  }

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }

  // Category filter chips
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.category;
      soundManager.playClick();
      renderTable();
    });
  });

  renderTable();
}
