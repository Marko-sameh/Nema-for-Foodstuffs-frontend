# Ne'ma Storefront (frontend)

Ne'ma is a bilingual (Arabic/English) e-commerce storefront for foodstuffs and
groceries sold by weight or by piece. This repository contains only the
**Next.js frontend** — product browsing, cart, checkout, customer accounts and
an admin dashboard (categories, users, orders, analytics). It is a pure client
of a separate REST API and does not talk to a database directly.

## Requirements

- Node.js 20+ (or Bun 1.x)
- The companion **backend API** running and reachable (see
  [`NEXT_PUBLIC_API_URL`](#environment-variables) below). This frontend has no
  business logic or persistence of its own — without the backend, pages that
  fetch data will fail.

## Getting started

```bash
# install dependencies
npm install
# or: bun install / pnpm install / yarn install

# copy environment variables and point them at your backend
cp .env.example .env.local

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Locales are served under
`/en` and `/ar` (e.g. `/en/products`, `/ar/products`); the root `/` redirects
to the default locale.

## Environment variables

All variables are documented in [`.env.example`](./.env.example); copy it to
`.env.local` and adjust as needed:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | **Required.** Base URL of the separate backend REST API (e.g. `http://localhost:3001/api/v1`). All product, cart, order, auth and admin requests are sent here. |
| `NEXT_PUBLIC_SITE_URL` | Public URL this app is deployed at. Used to build canonical URLs, `sitemap.xml`, `robots.txt` and Open Graph tags. |
| `E2E_BASE_URL` | Base URL Playwright e2e tests run against (defaults to `http://localhost:3000`). |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run unit/component tests with Vitest (`vitest run`). |
| `npm run test:e2e` | Run end-to-end tests with Playwright. |

## Internationalization & RTL

- Powered by [`next-intl`](https://next-intl.dev), with locale-prefixed
  routes (`/en/...`, `/ar/...`) configured in `src/i18n/routing.ts`.
- Translation strings live under `src/messages/<locale>/*.json`, split by
  feature (`common`, `products`, `cart`, `checkout`, `orders`, `account`,
  `admin`, `auth`).
- The root `[locale]` layout sets `<html lang={locale} dir={dir}>`, where
  `dir` is `rtl` for `ar` and `ltr` for `en` — the whole storefront (nav,
  forms, toasts, cart drawer, etc.) mirrors automatically for Arabic.
- The `Cairo` font is loaded (Arabic + Latin subsets) alongside `Poppins` for
  Latin text, selected via CSS variables in the layout.
- When adding UI copy, add keys to **both** `src/messages/en/*.json` and
  `src/messages/ar/*.json` — missing Arabic keys will fall back to the
  `defaultMessage` passed to `useTranslations`, which is usually English.

## SEO

- `generateMetadata` is used per-page (see `src/app/[locale]/(store)/**`) to
  produce localized `<title>`/`<meta description>` via `src/lib/seo.ts`.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `sitemap.xml` and
  `robots.txt` from `NEXT_PUBLIC_SITE_URL`.
- Structured data (JSON-LD for `Organization`/`WebSite`, and product schema
  where applicable) is emitted via the `JsonLd` component.
- Locale-aware canonical/alternate links are produced through the `next-intl`
  routing config so `en`/`ar` pages cross-link with `hreflang`.

## Testing

### Unit / component tests (Vitest + Testing Library)

```bash
npm run test
```

Configuration: `vitest.config.ts` (jsdom environment, `@` alias to `src`,
setup file `vitest.setup.ts`). Tests live alongside the code they cover, e.g.
`src/components/shared/__tests__/ProductCard.test.tsx`.

### End-to-end tests (Playwright)

```bash
# make sure the app (and the backend it talks to) is running,
# e.g. `npm run dev` in one terminal, then:
npm run test:e2e
```

Configuration: `playwright.config.ts`, tests under `e2e/`.

- `e2e/auth.setup.ts` runs first (as the `setup` project) and logs in a test
  user (`E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD`, defaulting to
  `test@example.com` / `password123`), saving the session to
  `e2e/.auth/user.json`.
- The `chromium` project depends on `setup` and reuses that storage state via
  the shared fixture in `e2e/fixtures/auth.ts` (`authedPage`), so specs that
  need an authenticated session don't repeat the login flow.
- Specs covering admin screens, account orders, and the full
  browse → add to cart → Cash on Delivery checkout flow
  (`e2e/checkout-flow.spec.ts`) use `authedPage`.
- `e2e/i18n-arabic.spec.ts` runs unauthenticated and asserts `/ar` renders
  with `dir="rtl"` and Arabic copy.
- Set `E2E_BASE_URL` to point Playwright at a different host, and
  `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` to a valid user in your backend for the
  login step to succeed.

## Deployment

This is a standard Next.js app and can be deployed to:

- **Vercel** — import the repo, set the environment variables from
  `.env.example` (at minimum `NEXT_PUBLIC_API_URL` and
  `NEXT_PUBLIC_SITE_URL`) in the project settings, and deploy. No extra
  configuration is required.
- **Any Node host** (Docker, a VM, Render, Railway, etc.) — run
  `npm run build` then `npm run start`, with the same environment variables
  provided at runtime/build time.

In all cases, `NEXT_PUBLIC_API_URL` must point at a publicly reachable
instance of the separate backend API — the storefront ships no server-side
data layer of its own and every request (products, cart, checkout, orders,
admin) is proxied straight to that URL.
