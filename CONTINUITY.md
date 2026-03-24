# CONTINUITY.md

## Goal (incl. success criteria):
- Страницы скачивания должны всегда получать актуальную версию и ссылки из GitHub Releases (не из локального файла).

## Constraints/Assumptions:
- `latest.json` хранится только в GitHub Releases, не в репозитории сайта.
- Fetch URL: `https://github.com/ByteFlipper-58/SectLauncher/releases/latest/download/latest.json`
- Fallback: `https://github.com/ByteFlipper-58/SectLauncher/releases/latest`

## Key decisions:
- [x] Убрать импорт локального `latest.json` из frontmatter.
- [x] Все ссылки по умолчанию ведут на fallback (GitHub Releases latest).
- [x] Версия и прямые ссылки подгружаются динамически на клиенте через fetch.
- [x] Локальный `public/latest.json` можно удалить.

## State:
- Done: Обновлены обе страницы (EN/RU download.astro). Билд 18 страниц без ошибок.
- Now: Готово.
- Next: Удалить `public/latest.json`.

## Open questions (UNCONFIRMED if needed):
- Нет.

## Working set (files/ids/commands):
- `src/pages/en/download.astro`
- `src/pages/ru/download.astro`
