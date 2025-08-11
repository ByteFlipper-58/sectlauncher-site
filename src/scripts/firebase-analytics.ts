// Инициализация Firebase Analytics (только в браузере)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, setAnalyticsCollectionEnabled, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDGE3JNXJp8c_4EmpXTw9rMES4V2LBLA60',
  authDomain: 'sectlauncher.firebaseapp.com',
  projectId: 'sectlauncher',
  storageBucket: 'sectlauncher.firebasestorage.app',
  messagingSenderId: '200769669419',
  appId: '1:200769669419:web:2a9b7ae31ffd00bb4d5d6e',
  measurementId: 'G-7Z4ZT6HVE5',
};

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

export async function initFirebaseAnalytics(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Инициализируем приложение (один раз)
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  // Проверяем поддержку Analytics в текущем окружении (например, Safari Private)
  try {
    if (await isSupported()) {
      analyticsInstance = getAnalytics(app);
      try {
        // Отправляем явный page_view, чтобы проверить поток событий (с debug флагом)
        logEvent(analyticsInstance as any, 'page_view', { debug_mode: true });
        // eslint-disable-next-line no-console
        console.log('[Analytics] initialized and page_view sent');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Analytics] logEvent failed', e);
      }
      // Включаем сбор явно на случай предыдущего отключения в рамках сессии
      try { setAnalyticsCollectionEnabled(analyticsInstance as any, true); } catch {}
    }
  } catch {
    // Тихо игнорируем, если среда не поддерживает Analytics
    // eslint-disable-next-line no-console
    console.warn('[Analytics] not supported in this environment');
  }
}

async function initializeIfConsented(): Promise<void> {
  // Запускаем только при явном согласии
  let consent: string | null = null;
  try {
    consent = localStorage.getItem('cookie-consent');
  } catch {}
  if (consent !== 'accepted') return;
  await initFirebaseAnalytics();
}

// Автозапуск после загрузки страницы
if (typeof window !== 'undefined') {
  // Автозапуск только если ранее было дано согласие
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    void initializeIfConsented();
  } else {
    window.addEventListener('DOMContentLoaded', () => void initializeIfConsented());
  }

  // Методы для CookieBanner
  (window as any).enableAnalytics = async () => {
    try { localStorage.setItem('cookie-consent', 'accepted'); } catch {}
    await initFirebaseAnalytics();
    if (analyticsInstance) {
      try { setAnalyticsCollectionEnabled(analyticsInstance as any, true); } catch {}
    }
    // eslint-disable-next-line no-console
    console.log('[Analytics] enabled by user consent');
  };
  (window as any).disableAnalytics = () => {
    try { localStorage.setItem('cookie-consent', 'declined'); } catch {}
    if (analyticsInstance) {
      try { setAnalyticsCollectionEnabled(analyticsInstance as any, false); } catch {}
    }
    // eslint-disable-next-line no-console
    console.log('[Analytics] disabled by user');
  };
}


