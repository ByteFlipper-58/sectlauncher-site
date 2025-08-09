import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analyticsInstance: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (!import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID) return null;
  try {
    const supported = await isSupported();
    analyticsInstance = supported ? getAnalytics(app) : null;
    try {
      // Экспонируем состояние для отладки
      (window as any).__fa = {
        supported,
        measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
        initialized: Boolean(analyticsInstance),
      };
      // Полезный лог
      // eslint-disable-next-line no-console
      console.info('[FA] init', {
        supported,
        measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
        initialized: Boolean(analyticsInstance),
      });
    } catch {}
    return analyticsInstance;
  } catch {
    return null;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  try {
    if (!analyticsInstance) return;
    logEvent(analyticsInstance, eventName, params as Record<string, never>);
  } catch {
    // no-op
  }
}

export function trackPageView(params?: Record<string, unknown>): void {
  try {
    if (!analyticsInstance) return;
    const baseParams: Record<string, unknown> = {
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      ...params,
    };
    logEvent(analyticsInstance, 'page_view', baseParams as Record<string, never>);
    // eslint-disable-next-line no-console
    console.info('[FA] page_view', baseParams);
  } catch {}
}

