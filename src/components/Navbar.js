import { soundManager } from '../audio/soundManager.js';

export function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const ambientLayer = document.getElementById('ambient-glow-layer');

  // 1. Scroll glass transformation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic Section Environmental Mood Lighting
    updateEnvironmentalLighting();
  }, { passive: true });

  // 2. Sound Toggle
  function updateSoundIcon(isMuted) {
    if (soundIcon) {
      soundIcon.textContent = isMuted ? '🔇' : '🔊';
    }
  }

  updateSoundIcon(soundManager.isMuted());

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = soundManager.toggleMute();
      updateSoundIcon(isMuted);
    });
  }

  // 3. Dynamic Section-based environmental background mood
  function updateEnvironmentalLighting() {
    if (!ambientLayer) return;

    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    const chooseWorldSec = document.getElementById('worlds');
    const galaxySec = document.getElementById('galaxy');
    const liveSec = document.getElementById('telemetry');
    const eventsSec = document.getElementById('events');

    if (chooseWorldSec) {
      const r = chooseWorldSec.getBoundingClientRect();
      if (r.top <= windowH / 2 && r.bottom >= windowH / 2) {
        // Shift to emerald / crimson duality
        ambientLayer.style.background = 'radial-gradient(circle at 30% 40%, rgba(239, 255, 0, 0.12) 0%, rgba(239, 255, 0, 0.1) 60%, transparent 80%)';
        return;
      }
    }

    if (galaxySec) {
      const r = galaxySec.getBoundingClientRect();
      if (r.top <= windowH / 2 && r.bottom >= windowH / 2) {
        // Celestial purple/blue
        ambientLayer.style.background = 'radial-gradient(circle at 50% 50%, rgba(239, 255, 0, 0.16) 0%, rgba(239, 255, 0, 0.08) 50%, transparent 75%)';
        return;
      }
    }

    if (liveSec || eventsSec) {
      const r = (liveSec || eventsSec).getBoundingClientRect();
      if (r.top <= windowH / 2 && r.bottom >= windowH / 2) {
        // Electric cyber cyan
        ambientLayer.style.background = 'radial-gradient(circle at 50% 40%, rgba(239, 255, 0, 0.14) 0%, rgba(239, 255, 0, 0.06) 60%, transparent 80%)';
        return;
      }
    }

    // Default Hero Atmosphere: Deep graphite / subtle cyan
    ambientLayer.style.background = 'radial-gradient(circle at 50% 30%, rgba(239, 255, 0, 0.08) 0%, transparent 65%)';
  }
}
