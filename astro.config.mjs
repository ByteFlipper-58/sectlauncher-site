// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// https://astro.build/config
export default defineConfig({
  // Публичный домен сайта
  site: 'https://sectlauncher.byteflipper.com',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },

  // markdown: { syntaxHighlight: 'shiki' }, // use Astro defaults

  integrations: [
    mdx({
      // Настройка компонентов для замены стандартных HTML элементов
      remarkRehype: {
        handlers: {
          // Обработчик для таблиц будет добавлен через MDX компоненты
        }
      }
    }), 
    sitemap({
      entryLimit: 50000,
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru',
          en: 'en'
        }
      },
      /** @type {(item: import('@astrojs/sitemap').SitemapItem) => import('@astrojs/sitemap').SitemapItem} */
      serialize(item) {
        // item.url — абсолютный URL
        const url = new URL(item.url);
        const path = url.pathname;
        const now = new Date().toISOString();

        /** @type {import('sitemap').EnumChangefreq | undefined} */
        let changefreq = undefined;
        let priority = 0.6;

        if (path === '/ru/' || path === '/en/') {
          changefreq = /** @type {import('sitemap').EnumChangefreq} */ ('daily');
          priority = 1.0;
        } else if (/\/(ru|en)\/blog\/?$/.test(path)) {
          changefreq = /** @type {import('sitemap').EnumChangefreq} */ ('daily');
          priority = 0.9;
        } else if (/\/(ru|en)\/blog\//.test(path)) {
          changefreq = /** @type {import('sitemap').EnumChangefreq} */ ('weekly');
          priority = 0.8;
        } else if (/\/(ru|en)\/download\/?$/.test(path)) {
          changefreq = /** @type {import('sitemap').EnumChangefreq} */ ('weekly');
          priority = 0.8;
        } else if (/\/(ru|en)\/(about|privacy|terms)\/?$/.test(path)) {
          changefreq = /** @type {import('sitemap').EnumChangefreq} */ ('monthly');
          priority = 0.7;
        }

        /** hreflang alternates (best-effort по зеркалам ru/en) */
        /** @type {Array<{ url: string; lang: string }>} */
        const links = [];
        if (path.startsWith('/ru/')) {
          links.push({ url: item.url, lang: 'ru' });
          links.push({ url: item.url.replace('/ru/', '/en/'), lang: 'en' });
          links.push({ url: item.url, lang: 'x-default' });
        } else if (path.startsWith('/en/')) {
          links.push({ url: item.url.replace('/en/', '/ru/'), lang: 'ru' });
          links.push({ url: item.url, lang: 'en' });
          links.push({ url: item.url.replace('/en/', '/ru/'), lang: 'x-default' });
        }

        // В продакшн не включаем приватные и отложенные посты в sitemap: фильтруем по эвристикам путей
        const isBlogPost = /\/(ru|en)\/blog\/.+/.test(path);

        return {
          url: item.url,
          changefreq,
          priority,
          lastmod: now,
          links
        };
      }
    }),
    // Переименовываем индекс карты сайта в sitemap.xml после сборки
    {
      name: 'sitemap-rename-to-root',
      hooks: {
        'astro:build:done': async ({ dir, logger }) => {
          try {
            const outDir = fileURLToPath(dir);
            const indexPath = path.join(outDir, 'sitemap-index.xml');
            const targetPath = path.join(outDir, 'sitemap.xml');
            // Если существует индекс, копируем как sitemap.xml
            await fs.copyFile(indexPath, targetPath).catch(() => {});
            // Если индекс отсутствует и генерируется одиночный sitemap-0.xml — используем его
            const singlePath = path.join(outDir, 'sitemap-0.xml');
            const existsSingle = await fs
              .access(singlePath)
              .then(() => true)
              .catch(() => false);
            const existsTarget = await fs
              .access(targetPath)
              .then(() => true)
              .catch(() => false);
            if (!existsTarget && existsSingle) {
              await fs.copyFile(singlePath, targetPath);
            }

            // Удаляем из sitemap-0.xml все URL премьер, которые ещё не доступны (помечены мета x-premiere=not-ready)
            if (existsSingle) {
              const toRemove = new Set();
              // Сканируем HTML в папках ru/en blog
              const blogRoots = [path.join(outDir, 'ru', 'blog'), path.join(outDir, 'en', 'blog')];
              for (const root of blogRoots) {
                /**
                 * @param {string} p
                 */
                const traverse = async (p) => {
                  let entries = [];
                  try { entries = await fs.readdir(p, { withFileTypes: true }); } catch { return; }
                  for (const e of entries) {
                    const full = path.join(p, e.name);
                    if (e.isDirectory()) { await traverse(full); continue; }
                    if (e.isFile() && e.name === 'index.html') {
                      try {
                        const html = await fs.readFile(full, 'utf8');
                        if (html.includes('name="x-premiere"') && html.includes('content="not-ready"')) {
                          const rel = full.replace(outDir, '').replace(/\\/g, '/');
                          const url = new URL(rel.startsWith('/') ? rel : `/${rel}`, 'https://sectlauncher.byteflipper.com').toString().replace(/index\.html$/, '');
                          toRemove.add(url.endsWith('/') ? url : `${url}`);
                        }
                      } catch {}
                    }
                  }
                };
                await traverse(root);
              }

              if (toRemove.size > 0) {
                try {
                  let xml = await fs.readFile(singlePath, 'utf8');
                  for (const url of toRemove) {
                    const esc = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const re = new RegExp(`<url>\\s*<loc>${esc}<\\/loc>[\\s\\S]*?<\\/url>`, 'g');
                    xml = xml.replace(re, '');
                  }
                  await fs.writeFile(singlePath, xml, 'utf8');
                } catch (e) {
                  const msg = (e && typeof e === 'object' && 'message' in e) ? /** @type {any} */(e).message : String(e);
                  logger?.warn?.(`sitemap prune failed: ${msg}`);
                }
              }
            }
          } catch (e) {
            const msg = (e && typeof e === 'object' && 'message' in e) ? /** @type {any} */(e).message : String(e);
            logger?.warn?.(`sitemap rename failed: ${msg}`);
          }
        }
      }
    }
  ]
});