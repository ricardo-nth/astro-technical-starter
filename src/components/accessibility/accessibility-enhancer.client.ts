function toggleClass(element: Element | null, className: string, enabled: boolean) {
  if (!(element instanceof HTMLElement)) return;
  element.classList.toggle(className, enabled);
}

function persistPreference(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value.toString());
  } catch (error) {
    console.warn('Failed to persist accessibility preference:', error);
  }
}

function loadPreference(key: string) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch (error) {
    console.warn('Failed to load accessibility preference:', error);
    return false;
  }
}

function initAccessibilityEnhancer() {
  const panel = document.getElementById('accessibility-panel');
  const trigger = document.getElementById('accessibility-trigger');
  const closeBtn = document.getElementById('close-accessibility');

  trigger?.addEventListener('click', () => {
    const isHidden = panel?.getAttribute('aria-hidden') === 'true';
    panel?.setAttribute('aria-hidden', (!isHidden).toString());
    trigger.setAttribute('aria-expanded', isHidden.toString());
  });

  closeBtn?.addEventListener('click', () => {
    panel?.setAttribute('aria-hidden', 'true');
    trigger?.setAttribute('aria-expanded', 'false');
  });

  const highContrastToggle = document.getElementById('high-contrast') as HTMLInputElement | null;
  const largeTextToggle = document.getElementById('large-text') as HTMLInputElement | null;
  const reducedMotionToggle = document.getElementById('reduced-motion') as HTMLInputElement | null;

  highContrastToggle?.addEventListener('change', function () {
    toggleClass(document.body, 'high-contrast', this.checked);
    persistPreference('accessibility-highContrast', this.checked);
  });

  largeTextToggle?.addEventListener('change', function () {
    toggleClass(document.body, 'large-text', this.checked);
    persistPreference('accessibility-largeText', this.checked);
  });

  reducedMotionToggle?.addEventListener('change', function () {
    toggleClass(document.body, 'reduced-motion', this.checked);
    persistPreference('accessibility-reducedMotion', this.checked);
  });

  const savedHighContrast = loadPreference('accessibility-highContrast');
  const savedLargeText = loadPreference('accessibility-largeText');
  const savedReducedMotion = loadPreference('accessibility-reducedMotion');

  toggleClass(document.body, 'high-contrast', savedHighContrast);
  toggleClass(document.body, 'large-text', savedLargeText);
  toggleClass(document.body, 'reduced-motion', savedReducedMotion);

  if (highContrastToggle) highContrastToggle.checked = savedHighContrast;
  if (largeTextToggle) largeTextToggle.checked = savedLargeText;
  if (reducedMotionToggle) reducedMotionToggle.checked = savedReducedMotion;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel?.getAttribute('aria-hidden') === 'false') {
      panel?.setAttribute('aria-hidden', 'true');
      trigger?.setAttribute('aria-expanded', 'false');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibilityEnhancer);
} else {
  initAccessibilityEnhancer();
}
