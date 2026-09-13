import { teamMembers, teamCategories } from '../data/team.js';
import { soundManager } from '../audio/soundManager.js';

export function initTeamSection() {
  const filterContainer = document.getElementById('team-filter-bar');
  const gridContainer = document.getElementById('team-grid');

  if (!gridContainer) return;

  // Render Filter Buttons
  if (filterContainer) {
    filterContainer.innerHTML = teamCategories.map((cat, idx) => `
      <button class="event-tab-btn team-cat-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat.id}">
        ${cat.label}
      </button>
    `).join('');

    const btns = filterContainer.querySelectorAll('.team-cat-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        soundManager.playClick();
        renderTeam(btn.dataset.cat);
      });
    });
  }

  function renderTeam(cat = 'all') {
    const filtered = cat === 'all'
      ? teamMembers
      : teamMembers.filter((m) => m.category === cat);

    gridContainer.innerHTML = filtered.map((m) => `
      <div class="glass-card team-card tilt-card">
        <div class="team-avatar" style="background: ${m.avatarColor};">
          ${m.name.slice(0, 2)}
        </div>
        <h3 class="team-name">${m.name}</h3>
        <div class="team-role">${m.role}</div>
        <p class="team-bio">${m.bio}</p>
        <div class="badge badge-live" style="font-size: 0.7rem;">${m.discordTag}</div>
      </div>
    `).join('');
  }

  renderTeam('all');
}
