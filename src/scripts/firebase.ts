import { initAnalytics, enableAnalytics, disableAnalytics, trackEvent, trackPageView } from '../lib/firebase.client';

// Expose functions globally for cookie banner
declare global {
  interface Window {
    initAnalytics: typeof initAnalytics;
    enableAnalytics: typeof enableAnalytics;
    disableAnalytics: typeof disableAnalytics;
  }
}

window.initAnalytics = initAnalytics;
window.enableAnalytics = enableAnalytics;
window.disableAnalytics = disableAnalytics;

async function bootstrap() {
  // Check if user has accepted cookies
  const cookieConsent = localStorage.getItem('cookie-consent');
  
  if (cookieConsent === 'accepted') {
    const analytics = await initAnalytics();
    if (!analytics) return;
    
    // Включим debug_mode и отправим первичный page_view
    trackEvent('page_view', { debug_mode: true });
    trackPageView({ debug_mode: true });
    
    setupEventListeners();
  } else if (cookieConsent === 'declined') {
    // Analytics explicitly disabled
    return;
  }
  // If no choice made yet, wait for cookie banner
}

  // Отправка page_view на смену истории (Astro статический, но на всякий случай)
  window.addEventListener('popstate', () => trackPageView({ debug_mode: true }));
  const pushState = history.pushState;
  history.pushState = function (...args) {
    // @ts-ignore
    const ret = pushState.apply(this, args as any);
    trackPageView({ debug_mode: true });
    return ret;
  } as typeof history.pushState;

  // Главная: кнопки
  document.querySelectorAll('a[href^="/download"]').forEach((a) => {
    a.addEventListener('click', () => trackEvent('click_download_cta', { location: 'home' }));
  });
  document.querySelectorAll('a[href*="github.com/byteflipper-58/sectlauncher"]').forEach((a) => {
    a.addEventListener('click', () => trackEvent('click_github', { location: 'home' }));
  });
  document.querySelectorAll('a[href*="t.me"]').forEach((a) => {
    a.addEventListener('click', () => trackEvent('click_telegram', { location: 'home' }));
  });

  // Страница загрузки: CTA и карточки
  const ctaLink = document.getElementById('cta-link');
  if (ctaLink) {
    ctaLink.addEventListener('click', () => {
      const os = (document.getElementById('cta-label')?.textContent || '').toLowerCase();
      trackEvent('download_cta_click', { os });
    });
  }
  const cards = [
    { id: 'card-win', os: 'windows' },
    { id: 'card-mac', os: 'mac' },
    { id: 'card-linux', os: 'linux' }
  ];
  for (const { id, os } of cards) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => trackEvent('download_card_click', { os }));
  }

  // Переключение табов ОС
  const osTabs = document.getElementById('os-tabs');
  if (osTabs) {
    osTabs.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      const os = btn?.getAttribute('data-os');
      if (os) trackEvent('os_tab_click', { os });
    });
  }

  // Копирование SHA‑256
  const copyBtn = document.getElementById('copy-hash');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => trackEvent('copy_sha256'));
  }
}

bootstrap();

