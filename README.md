# SectLauncher.com — сайт (Astro)

![Astro](https://img.shields.io/badge/Astro-5.x-ff5d01?logo=astro&logoColor=white)
![MDX](https://img.shields.io/badge/MDX-enabled-1f1f1f)
![i18n](https://img.shields.io/badge/i18n-ru%20%7C%20en-0b7285)
![SEO](https://img.shields.io/badge/SEO-canonical%2Fhreflang%2FJSON--LD-1877f2)
![Hosting](https://img.shields.io/badge/Hosting-Firebase-orange)

Проект сайта SectLauncher на Astro с i18n (ru/en), блогом (MDX), расширенным SEO и поддержкой премьер‑постов (отложенная публикация, «Премьера» в ленте).

— Сайт проекта: `https://sectlauncher.byteflipper.com`
— Сайт разработчика: `https://byteflipper.com`

## Быстрый старт

```sh
npm ci
npm run dev
```

Локально сайт будет доступен на `http://localhost:4321`.

## Скрипты

- `npm run dev` — дев‑сервер
- `npm run build` — сборка в `dist/`
- `npm run preview` — предпросмотр сборки

## Структура

```text
/
├── public/            # статика (favicon, robots.txt, webmanifest)
├── src/
│  ├── pages/          # страницы ru/en
│  ├── components/     # компоненты (в т.ч. посты/SEO)
│  ├── layouts/        # базовый layout
│  ├── content/        # контент блога (MDX) c фронт‑материей
│  └── styles/         # стили
└── astro.config.mjs   # конфиг Astro (i18n, sitemap и пр.)
```

## Блог и фронт‑материя

В `src/content/blog/{ru|en}/*.mdx` поддерживаются поля:

- `title` — заголовок (строка)
- `description` — описание (опционально)
- `date` — дата публикации (Date)
- `tags` — массив тегов (опционально)
- `lang` — `ru` | `en` (по умолчанию `ru`)
- `tKey` — ключ связи перевода (опционально)
- `draft` — черновик (bool, по умолчанию `false`)
- `private` — виден только локально, скрыт в проде (bool)
- `publishAt` — отложенная публикация/премьера (Date ISO, указывайте с таймзоной, напр. `2025-08-11T15:00:00+02:00` для Варшавы)
- `premiere` — отмечает пост как «премьерный»: в ленте показывается «Премьера», до времени — страница недоступна

Поведение:
- В продакшене скрываются `draft`, `private`, а также посты с будущим `publishAt`.
- Если `premiere: true` и `publishAt` в будущем: в ленте отображается карточка «Премьера», клик отключён; страница не генерируется до момента релиза.
- После наступления `publishAt` требуется пересборка (SSG). Для авто‑публикации используйте GitHub Actions по cron или переведите проект на SSR (Vercel).

## SEO и i18n

- Каноникал и `hreflang` для ru/en на всех страницах
- Open Graph/Twitter метаданные, JSON‑LD для статей
- Генерация sitemap с `lastmod`, `changefreq`, `priority`, `hreflang`; основной файл — `sitemap.xml`
- Индексация по умолчанию отключена: `<meta name="robots" content="noindex, nofollow">`, `X‑Robots‑Tag` в Firebase и `robots.txt` с Disallow. Включается через `PUBLIC_ALLOW_INDEXING=true` и правку заголовков/robots.txt.

## Деплой

- По умолчанию проект настроен под статическую сборку (SSG) и деплой на Firebase Hosting (`firebase.json`).
- Для авто‑премьер без ребилда — перевести на SSR (напр., Vercel) и проверять `publishAt` на сервере.

## Переменные окружения

- `PUBLIC_ALLOW_INDEXING` — `true`/`false` для включения индексации в `<meta name="robots">`

## Контакты

- Email: `byteflipper.business@gmail.com`
- Сайт разработчика: `https://byteflipper.com`
- Сайт проекта: `https://sectlauncher.byteflipper.com`

## Правовой статус

Автор и правообладатель запрещает использование исходников данного сайта (включая дизайн, стили, контент и компоненты) без предварительного письменного разрешения. Любое копирование, распространение, модификация и/или коммерческое использование исходного кода или его частей не допускается.

Для получения разрешения свяжитесь по адресу: `byteflipper.business@gmail.com`.
