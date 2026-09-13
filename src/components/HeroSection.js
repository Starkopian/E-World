import { soundManager } from '../audio/soundManager.js';

export function initHeroSection() {
  const eLayer = document.querySelector('.hero-title-e');
  const dashLayer = document.querySelector('.hero-title-dash');
  const worldLayer = document.querySelector('.hero-title-world');
  const heroSection = document.querySelector('.hero-section');

  if (!heroSection || !eLayer || !worldLayer) return;

  // 3D Holographic Typography Depth Separation
  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    // Background Depth Layer ('E')
    eLayer.style.transform = `translate3d(${normX * 8}px, ${normY * 8}px, 20px) rotateY(${normX * 5}deg)`;

    // Mid Depth ('-')
    if (dashLayer) {
      dashLayer.style.transform = `translate3d(${normX * 14}px, ${normY * 14}px, 35px)`;
    }

    // Foreground Depth Layer ('WORLD')
    worldLayer.style.transform = `translate3d(${normX * 22}px, ${normY * 22}px, 55px) rotateY(${normX * 8}deg)`;
  });

  // Action Buttons
  const exploreBtn = document.getElementById('hero-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('worlds');
      if (target) {
        soundManager.playPortal();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const joinBtn = document.getElementById('hero-join-btn');
  if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('discord-cta');
      if (target) {
        soundManager.playClick();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
