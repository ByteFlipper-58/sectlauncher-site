// SEO утилиты для правильной работы с мультиязычным сайтом

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: 'ru' | 'en';
  alternateUrls?: {
    ru?: string;
    en?: string;
  };
}

export function generateCanonicalUrl(path: string, baseUrl = 'https://sectlauncher.byteflipper.com'): string {
  // Убираем trailing slash из baseUrl
  const cleanBase = baseUrl.replace(/\/$/, '');
  
  // Нормализуем путь
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
}

export function generateAlternateUrls(currentPath: string, baseUrl = 'https://sectlauncher.byteflipper.com'): {
  ru: string;
  en: string;
  canonical: string;
} {
  const cleanBase = baseUrl.replace(/\/$/, '');
  
  // Определяем базовый путь без локали
  let basePath = currentPath;
  if (currentPath.startsWith('/ru/')) {
    basePath = currentPath.replace('/ru/', '/');
  } else if (currentPath.startsWith('/en/')) {
    basePath = currentPath.replace('/en/', '/');
  }
  
  // Если basePath это просто "/", делаем его пустым для корректных URL
  if (basePath === '/') basePath = '';
  
  return {
    ru: `${cleanBase}/ru${basePath}`,
    en: `${cleanBase}/en${basePath}`,
    canonical: currentPath.startsWith('/en/') 
      ? `${cleanBase}/en${basePath}` 
      : `${cleanBase}/ru${basePath}`
  };
}

export function getCurrentLocale(path: string): 'ru' | 'en' {
  if (path.startsWith('/en/')) return 'en';
  return 'ru'; // default
}

export function getOgLocale(locale: 'ru' | 'en'): string {
  return locale === 'ru' ? 'ru_RU' : 'en_US';
}

export function generateJsonLd(data: SEOData & { url: string }): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': data.ogType === 'article' ? 'Article' : 'WebPage',
    headline: data.title,
    description: data.description,
    url: data.url,
    inLanguage: data.locale || 'ru',
  };

  if (data.ogType === 'article') {
    if (data.publishedTime) jsonLd.datePublished = data.publishedTime;
    if (data.modifiedTime) jsonLd.dateModified = data.modifiedTime;
    if (data.author) {
      jsonLd.author = {
        '@type': 'Person',
        name: data.author
      };
    }
  }

  if (data.ogImage) {
    jsonLd.image = [data.ogImage];
  }

  // Добавляем информацию об организации
  jsonLd.publisher = {
    '@type': 'Organization',
    name: 'SectLauncher',
    url: 'https://sectlauncher.byteflipper.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://sectlauncher.byteflipper.com/web-app-manifest-512x512.png'
    }
  };

  return jsonLd;
}

// Утилита для отслеживания навигации в аналитике
export async function trackNavigation(fromPath: string, toPath: string): Promise<void> {
  try {
    const { trackEvent } = await import('./analytics');
    await trackEvent('page_navigation', {
      from_path: fromPath,
      to_path: toPath,
      from_locale: getCurrentLocale(fromPath),
      to_locale: getCurrentLocale(toPath),
      event_category: 'navigation',
    });
  } catch {
    // Тихо игнорируем ошибки аналитики
  }
}