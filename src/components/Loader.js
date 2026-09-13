import { soundManager } from '../audio/soundManager.js';

export function initLoader(onComplete) {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const steps = [
    document.getElementById('step-core'),
    document.getElementById('step-community'),
    document.getElementById('step-smp'),
    document.getElementById('step-rp'),
    document.getElementById('step-enter')
  ];

  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      if (currentStep > 0 && steps[currentStep - 1]) {
        steps[currentStep - 1].classList.remove('active');
        steps[currentStep - 1].classList.add('done');
      }
      if (steps[currentStep]) {
        steps[currentStep].classList.add('active');
        soundManager.playHover();
      }
      currentStep++;
    } else {
      clearInterval(interval);
      soundManager.playSuccess();

      setTimeout(() => {
        preloader.classList.add('hidden');
        if (onComplete) onComplete();
      }, 350);
    }
  }, 220);
}
