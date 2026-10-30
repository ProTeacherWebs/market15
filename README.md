# VOLT STORE

Магазин бытовой техники (Ташкент). Сайт на Next.js: каталог из Neon, аккаунт (email + Google), заказы и тестовая оплата Stripe.

Стек: Next.js, TypeScript, Tailwind CSS, Neon, Drizzle ORM, Auth.js, Stripe Checkout.

Дизайн-токены: `src/design/tokens.ts`, `src/app/globals.css`.  
Правила: `.cursor/skills/taste/SKILL.md`, `.cursor/skills/frontend-design/SKILL.md`, `.cursor/skills/anti-ai-slop/SKILL.md`.

## Локальный запуск

```bash
npm install
cp .env.example .env
```

Заполните `.env` (минимум `DATABASE_URL`, `AUTH_SECRET`). Затем:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Откройте http://localhost:3000.

Полная пересборка схемы и сид:

```bash
npm run db:setup
```

## Переменные окружения

Смотрите `.env.example`. Кратко:

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | Neon pooled URL |
| `DATABASE_URL_UNPOOLED` | Neon direct (миграции/скрипты при необходимости) |
| `AUTH_SECRET` | Секрет Auth.js |
| `AUTH_URL` / `APP_URL` | Публичный URL сайта (`https://…` на Vercel) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth |
| `PAYMENT_MODE` | `stripe_test` (по умолчанию) или `stripe_live` |
| `STRIPE_SECRET_KEY` | `sk_test_…` или `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` |
| `STRIPE_UZS_PER_USD` | Курс для конвертации UZS→USD в Stripe |

Секреты только в `.env` / Vercel Environment Variables. Файл `.env` в Git не коммитится.

## Публикация на Vercel

1. Импортируйте репозиторий в Vercel.
2. Добавьте те же переменные, что в `.env`.  
   `AUTH_URL=https://ваш-домен.vercel.app` (без `/` в конце).
3. Deploy.
4. Миграции к production-базе (локально или в CI, с production `DATABASE_URL`):

```bash
npm run db:migrate
```

5. При пустой базе: `npm run db:seed`.

### Google OAuth (production)

В Google Cloud → OAuth client:

- Origin: `https://ваш-домен.vercel.app`
- Redirect: `https://ваш-домен.vercel.app/api/auth/callback/google`

Локально дополнительно: `http://localhost:3000` и `…/api/auth/callback/google`.

### Stripe test mode

1. Dashboard → Developers → API keys → `sk_test_…` в `STRIPE_SECRET_KEY`.
2. Webhooks → endpoint `https://ваш-домен.vercel.app/api/stripe/webhook`  
   События: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`.
3. `PAYMENT_MODE=stripe_test`. Live-ключ `sk_live_` при этом режиме **отклоняется кодом**.
4. Тестовая карта: `4242 4242 4242 4242`.

Локальный webhook:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Telegram Mini App

Вход: `https://ваш-домен.vercel.app/tg` (те же токены и Neon).

1. Создайте бота в [@BotFather](https://t.me/BotFather).
2. `/newapp` → укажите URL `https://ваш-домен.vercel.app/tg`.
3. В Vercel / `.env`: `TELEGRAM_BOT_TOKEN=<токен бота>`.
4. Redeploy. Откройте Mini App из Telegram на телефоне.

Сервер проверяет `initData` (HMAC), создаёт/находит пользователя по `telegram_id`, пишет корзину, избранное и заказы в ту же базу.

## Приватность и безопасность

- Корзина/избранное гостя — в `localStorage`; после входа — в Neon с merge.
- Заказы и оплата только для владельца (`userId` из сессии).
- Сумма оплаты берётся из заказа в БД, не из браузера.
- Подтверждение оплаты: Stripe webhook (подпись) + сверка сессии при возврате.
- Приватные пути закрыты от индексации в `robots.ts`: `/account`, `/checkout`, `/api/`, `/login`, `/register`.

## SEO

- `sitemap.xml` — активные категории и товары из Neon.
- `robots.txt` — правила + ссылка на sitemap.
- `metadataBase` / Open Graph на корне и карточках товара.

## Чеклист после деплоя

- [ ] Главная → каталог → товар → корзина → оформление на телефоне и десктопе
- [ ] Регистрация / вход email и Google
- [ ] Чужой номер заказа не открывается
- [ ] Stripe test: оплата `4242…`, статус «оплачен»
- [ ] `/sitemap.xml` и `/robots.txt` открываются
- [ ] `PAYMENT_MODE=stripe_test`, нет `sk_live_` в production до согласования

## Поддержка

| Задача | Команда / место |
|---|---|
| Dev-сервер | `npm run dev` |
| Lint | `npm run lint` |
| Миграции | `npm run db:migrate` |
| Сид каталога | `npm run db:seed` |
| Логи Vercel | Project → Deployments → Logs |
| Ошибки оплаты | Stripe Dashboard → Logs / Webhooks |

План этапов: `Tasks.md`. Спецификация: `SPEC.md`.
