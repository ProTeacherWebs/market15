# VOLT STORE

Сайт магазина бытовой техники. Каталог, категории и карточки товаров читаются из Neon PostgreSQL через Drizzle.

Стек: Next.js, TypeScript, Tailwind CSS, Neon, Drizzle ORM. Дизайн-токены лежат в `src/design/tokens.ts` и повторены в `src/app/globals.css`.

Правила оформления: `.cursor/skills/taste/SKILL.md`, `.cursor/skills/frontend-design/SKILL.md`, `.cursor/skills/anti-ai-slop/SKILL.md`.

## Запуск

```bash
npm install
```

Скопируйте `.env.example` в `.env` и укажите `DATABASE_URL` Neon.

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Сайт открывается на http://localhost:3000.

Повторная подготовка базы:

```bash
npm run db:setup
```

Секреты кладутся в `.env`. Файл `.env` не коммитится. Имена переменных смотрите в `.env.example`.

Временный Neon-проект (`neon claim create`) живёт ограниченное время. Чтобы оставить базу себе, claim-ните проект в аккаунт Neon.
