import { soundManager } from '../audio/soundManager.js';

export function initLiquidCursor() {
  const dot = document.querySelector('.liquid-cursor-dot');
  const aura = document.querySelector('.liquid-cursor-aura');
  const morphOverlay = document.querySelector('.liquid-morph-overlay');

  if (!dot || !aura) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth animation loop for aura
  function animate() {
    auraX += (mouseX - auraX) * 0.18;
    auraY += (mouseY - auraY) * 0.18;
    aura.style.left = `${auraX}px`;
    aura.style.top = `${auraY}px`;
    requestAnimationFrame(animate);
  }
  animate();

  // Magnetic Pull & Sound Hook on interactive elements
  function attachInteractivity() {
    const interactables = document.querySelectorAll('a, button, .btn, .interactive-node, .tilt-card, .portal-half');

    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hovering');
        soundManager.playHover();

        if (el.classList.contains('portal-smp')) {
          document.body.classList.add('cursor-hovering-smp');
        } else if (el.classList.contains('portal-rp')) {
          document.body.classList.add('cursor-hovering-rp');
        }
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hovering', 'cursor-hovering-smp', 'cursor-hovering-rp');
        el.style.transform = '';
      });

      // Magnetic effect on buttons
      if (el.classList.contains('btn') || el.classList.contains('magnetic')) {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.25;
          const deltaY = (e.clientY - centerY) * 0.25;
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
      }

      // 3D Tilt Card effect
      if (el.classList.contains('tilt-card')) {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
      }

      // Sound on click
      el.addEventListener('click', () => {
        soundManager.playClick();
      });
    });

    // Liquid Screen Morph on Navigation Links
    const navAnchors = document.querySelectorAll('a[href^="#"]');
    navAnchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || !targetId) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl && morphOverlay) {
          e.preventDefault();

          // Position morph at click point
          morphOverlay.style.left = `${e.clientX}px`;
          morphOverlay.style.top = `${e.clientY}px`;
          morphOverlay.classList.remove('fading');
          morphOverlay.classList.add('expanding');

          soundManager.playPortal();

          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 300);

          setTimeout(() => {
            morphOverlay.classList.remove('expanding');
            morphOverlay.classList.add('fading');
          }, 600);
        }
      });
    });
  }

  attachInteractivity();

  // Expose re-attach for dynamically loaded content
  return { attachInteractivity };
}
