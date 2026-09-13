import { soundManager } from '../audio/soundManager.js';

export function initDiscordCTA() {
  const joinBtn = document.getElementById('discord-direct-join-btn');
  const copyBtn = document.getElementById('discord-copy-link-btn');

  if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      soundManager.playSuccess();
      window.open('https://discord.gg/eworld', '_blank');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('https://discord.gg/eworld').then(() => {
        soundManager.playSuccess();
        const origText = copyBtn.textContent;
        copyBtn.textContent = 'Copied to Clipboard! ✓';
        setTimeout(() => {
          copyBtn.textContent = origText;
        }, 2000);
      });
    });
  }
}
