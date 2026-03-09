# CONTINUITY.md

- Goal (incl. success criteria): Редизайн страницы Privacy Policy в "High-Tech Premium" стиле, соответствующем общему стилю сайта, но с более компактными размерами (не "огромными").
- Constraints/Assumptions: 
    - Острые углы (sharp corners) - глобальное требование.
    - Стиль сайта: шрифты Hero ~5xl, обычные заголовки ~4xl, сетки и технические акценты.
    - Две языковые версии (RU/EN).
- Key decisions:
    - Уменьшить `text-8xl/9xl` до `text-4xl/5xl`.
    - Сократить вертикальные отступы (`py-24` -> `py-12`, `space-y-32` -> `space-y-16`).
    - Сделать декоративные элементы тише.
- State: В процессе оптимизации размеров.
- Done: Базовая структура, High-Tech элементы.
- Now: Оптимизация RU версии.
- Next: Оплимизация EN версии.
- Open questions (UNCONFIRMED if needed): 
    - Должны ли углы быть ВЕЗДЕ острыми на сайте, или только на этой странице? (Уже было сказано "глобально с острыми углами", так что следуем этому).
- Working set (files/ids/commands): [privacy.astro](file:///c:/Users/ibrag/Documents/GitHub/sectlauncher-site/src/pages/ru/privacy.astro), [en/privacy.astro](file:///c:/Users/ibrag/Documents/GitHub/sectlauncher-site/src/pages/en/privacy.astro)
