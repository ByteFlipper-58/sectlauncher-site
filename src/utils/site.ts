export type SupportedLocale = 'ru' | 'en';

export const DEFAULT_LOCALE: SupportedLocale = 'ru';
export const SITE_NAME = 'SectLauncher';
export const SITE_URL = 'https://sectlauncher.byteflipper.com';
export const GITHUB_REPO_URL = 'https://github.com/byteflipper-58/sectlauncher';
export const TELEGRAM_URL = 'https://t.me/sectlauncher';
export const RELEASES_API_URL = 'https://api.github.com/repos/ByteFlipper-58/SectLauncher/releases/latest';
export const RELEASES_FALLBACK_URL = 'https://github.com/ByteFlipper-58/SectLauncher/releases/latest';

export function toAbsoluteUrl(pathOrUrl: string | undefined, baseUrl = SITE_URL): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${cleanBase}${cleanPath}`;
}

export function getLocalizedBasePath(locale: SupportedLocale): string {
  return `/${locale}`;
}

export function buildLocalizedPath(locale: SupportedLocale, path = ''): string {
  const base = getLocalizedBasePath(locale);
  if (!path || path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
