// Утилиты для работы с Firebase Analytics
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, setAnalyticsCollectionEnabled, logEvent, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDGE3JNXJp8c_4EmpXTw9rMES4V2LBLA60',
  authDomain: 'sectlauncher.firebaseapp.com',
  projectId: 'sectlauncher',
  storageBucket: 'sectlauncher.firebasestorage.app',
  messagingSenderId: '200769669419',
  appId: '1:200769669419:web:2a9b7ae31ffd00bb4d5d6e',
  measurementId: 'G-7Z4ZT6HVE5',
};

let analyticsInstance: Analytics | null = null;
let isInitialized = false;

// Проверяем согласие пользователя
export function hasUserConsent(): boolean {
  try {
    return localStorage.getItem('cookie-consent') === 'accepted';
  } catch {
    return false;
  }
}

// Инициализация Firebase Analytics
export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (isInitialized) return analyticsInstance;

  try {
    // Проверяем поддержку Analytics
    if (!(await isSupported())) {
      console.warn('[Analytics] Not supported in this environment');
      return null;
    }

    // Инициализируем Firebase App
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    
    // Получаем Analytics instance
    analyticsInstance = getAnalytics(app);
    isInitialized = true;

    // Настраиваем сбор данных в зависимости от согласия
    const hasConsent = hasUserConsent();
    await setAnalyticsCollectionEnabled(analyticsInstance, hasConsent);

    if (hasConsent) {
      // Отправляем начальное событие page_view
      await trackPageView();
      console.log('[Analytics] Initialized with user consent');
    } else {
      console.log('[Analytics] Initialized but disabled (no consent)');
    }

    return analyticsInstance;
  } catch (error) {
    console.error('[Analytics] Initialization failed:', error);
    return null;
  }
}

// Включение аналитики после согласия
export async function enableAnalytics(): Promise<void> {
  try {
    localStorage.setItem('cookie-consent', 'accepted');
  } catch {}

  if (!analyticsInstance) {
    await initAnalytics();
  }

  if (analyticsInstance) {
    try {
      await setAnalyticsCollectionEnabled(analyticsInstance, true);
      await trackPageView();
      console.log('[Analytics] Enabled by user consent');
    } catch (error) {
      console.error('[Analytics] Failed to enable:', error);
    }
  }
}

// Отключение аналитики
export async function disableAnalytics(): Promise<void> {
  try {
    localStorage.setItem('cookie-consent', 'declined');
  } catch {}

  if (analyticsInstance) {
    try {
      await setAnalyticsCollectionEnabled(analyticsInstance, false);
      console.log('[Analytics] Disabled by user');
    } catch (error) {
      console.error('[Analytics] Failed to disable:', error);
    }
  }
}

// Отслеживание просмотра страницы
export async function trackPageView(customPath?: string): Promise<void> {
  if (!analyticsInstance || !hasUserConsent()) return;

  try {
    const currentPath = customPath || window.location.pathname;
    const currentLocale = getCurrentLocale();
    
    await logEvent(analyticsInstance, 'page_view', {
      page_path: currentPath,
      page_title: document.title,
      page_location: window.location.href,
      language: currentLocale,
      content_group1: currentLocale, // Группировка по языку
      content_group2: getPageCategory(currentPath), // Категория страницы
    });
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

// Отслеживание пользовательских событий
export async function trackEvent(
  eventName: string, 
  parameters?: Record<string, any>
): Promise<void> {
  if (!analyticsInstance || !hasUserConsent()) return;

  try {
    await logEvent(analyticsInstance, eventName, {
      ...parameters,
      language: getCurrentLocale(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(`[Analytics] Failed to track event ${eventName}:`, error);
  }
}

// Получение текущей локали из URL
function getCurrentLocale(): string {
  const path = window.location.pathname;
  if (path.startsWith('/en/')) return 'en';
  if (path.startsWith('/ru/')) return 'ru';
  return 'ru'; // default
}

// Определение категории страницы для аналитики
function getPageCategory(path: string): string {
  if (path.includes('/blog/')) return 'blog_post';
  if (path.includes('/blog')) return 'blog_list';
  if (path.includes('/download')) return 'download';
  if (path.includes('/about')) return 'about';
  if (path.includes('/privacy')) return 'privacy';
  if (path.includes('/terms')) return 'terms';
  if (path === '/ru/' || path === '/en/' || path === '/') return 'home';
  return 'other';
}

// Отслеживание скачиваний
export async function trackDownload(platform: string, version?: string): Promise<void> {
  await trackEvent('download_attempt', {
    platform,
    version: version || 'unknown',
    event_category: 'engagement',
  });
}

// Отслеживание поиска в блоге
export async function trackBlogSearch(query: string, resultsCount: number): Promise<void> {
  await trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
    event_category: 'engagement',
  });
}

// Отслеживание социальных действий
export async function trackSocialShare(platform: string, url: string): Promise<void> {
  await trackEvent('share', {
    method: platform,
    content_type: 'article',
    item_id: url,
    event_category: 'engagement',
  });
}

// Отслеживание подписки на Telegram
export async function trackTelegramSubscribe(): Promise<void> {
  await trackEvent('subscribe', {
    method: 'telegram',
    event_category: 'engagement',
  });
}

// Глобальные методы для CookieBanner
if (typeof window !== 'undefined') {
  (window as any).enableAnalytics = enableAnalytics;
  (window as any).disableAnalytics = disableAnalytics;
}