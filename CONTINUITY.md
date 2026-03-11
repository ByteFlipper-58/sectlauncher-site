# CONTINUITY.md

## Goal (incl. success criteria):
- Обновить главную страницу сайта SectLauncher (RU и EN версии).
- Заменить все скриншоты на актуальные из `/screenshots/`.
- Добавить новые блоки с описанием функций и скриншотами.
- Заменить раздел Roadmap на список реализованного функционала (учесть, что Modrinth и сборки уже реализованы).

## Constraints/Assumptions:
- Использовать только изображения из `public/screenshots`.
- Сохранять стилистику сайта (Tailwind CSS).
- Обновлять обе версии (RU/EN).

## Key decisions:
- [x] Использовать `sectlauncher_home.png` для блока "Rust".
- [x] Использовать `sectlauncher_library.png` для блока "Modrinth".
- [NEW] Добавить блок "Детали мода" (`sectlauncher_mod_details.png`) с описанием выбора версий и обновлений.
- [NEW] Добавить блок "Менеджер Аккаунтов" (`sectlauncher_account_profile.png`) с описанием входа через Microsoft и Offline.

## State:
- Done: Исправлены синтаксические ошибки разметки. Обновлен план.
- Now: Реализация новых блоков и перестановка скриншотов в RU/EN версиях.
- Next: Финальное тестирование.

## Open questions (UNCONFIRMED if needed):
- Какие именно описания добавить к новым скриншотам? (Сформулирую на основе названий файлов).

## Working set (files/ids/commands):
- `src/pages/ru/index.astro`
- `src/pages/en/index.astro`
- `public/screenshots/`
