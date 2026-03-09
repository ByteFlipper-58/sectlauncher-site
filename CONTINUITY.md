# CONTINUITY.md

- Goal (incl. success criteria): Обновление карточек загрузки: добавление поддержки множественных форматов файлов, редизайн в строгом стиле (острые углы, отсутствие свечений).
- Constraints/Assumptions: 
    - Острые углы (sharp corners), High-Tech стиль.
    - Никаких свечений и градиентов.
    - Две языковые версии (RU/EN).
- Key decisions:
    - Перейти на `rounded-none` для всех элементов карточки.
    - Использовать `bg-neutral-900` и `bg-neutral-950` для чистых фонов.
    - Сохранить функционал split-buttons для форматов.
- State: Адаптация под новый формат `latest.json` завершена. Прямые ссылки на скачивание работают.
- Done: Базовая страница загрузки, dropdowns, иконки, редизайн по новым требованиям, премиальная типографика (Outfit), обновление всех юридических страниц (RU/EN), адаптация под новый JSON формат и пре-филлинг ссылок на стороне сервера.
- Now: Готов к новым задачам.
- Next: 
- Open questions (UNCONFIRMED if needed): 
- Working set (files/ids/commands): [download.astro (RU)](file:///c:/Users/ibrag/Documents/GitHub/sectlauncher-site/src/pages/ru/download.astro), [download.astro (EN)](file:///c:/Users/ibrag/Documents/GitHub/sectlauncher-site/src/pages/en/download.astro)
