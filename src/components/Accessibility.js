export function initAccessibility() {
  const modal = document.getElementById('general-modal');
  let previousFocus;
  const focusable = () => [...modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')];
  new MutationObserver(() => {
    if (modal.classList.contains('active')) {
      previousFocus = document.activeElement;
      document.body.style.overflow = 'hidden';
      focusable()[0]?.focus();
    } else {
      document.body.style.overflow = '';
      previousFocus?.focus();
    }
  }).observe(modal, { attributes: true, attributeFilter: ['class'] });
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.classList.remove('active');
  });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('active')) return;
    if (event.key === 'Escape') modal.classList.remove('active');
    if (event.key === 'Tab') {
      const items = focusable(), first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
}
