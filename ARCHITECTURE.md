# ARCHITECTURE — jumper-exchange

Shape of this Next.js app. See [AGENTS.md](./AGENTS.md) for how to work in this repo (run, test, conventions, where new things go).

## What this app is

The B2C frontend for [jumper.xyz](https://jumper.xyz). Users land here to bridge and swap between any tokens across any chains (EVM, SVM, Sui, Bitcoin, Tron). Retention features (earn, portfolio, quests, campaigns, missions) are layered on top of the core swap flow.

The app embeds the `@jumperexchange/widget` for the swap UX and wraps it with Jumper-specific surfaces (auth, profile, XP, content, partner themes, …).

## Stack

| Layer           | Choice                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router) on React 19 with the React Compiler                                                   |
| Styling         | MUI v9 + Emotion                                                                                              |
| Server state    | `@tanstack/react-query`                                                                                       |
| Client state    | `zustand` (one store per feature, under `src/stores/<feature>/`)                                              |
| Forms           | `@tanstack/react-form`                                                                                        |
| i18n            | `next-i18n-router` + `i18next`, locale segment in the URL (`/[lng]/…`)                                        |
| Wallet          | `@lifi/sdk` + `@jumperexchange/widget` + per-chain providers (EVM via Wagmi/Viem, Solana, Sui, Bitcoin, Tron) |
| Observability   | Sentry (browser + server + edge)                                                                              |
| Tests           | Playwright (E2E), Vitest (unit, snapshot, Storybook)                                                          |
| Package manager | pnpm (`packageManager` field pins the version)                                                                |

## Directory layout

```
jumper-exchange/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [lng]/               # all user-facing pages — locale-prefixed
│   │   │   ├── (main)/          # route group: landing + main shell
│   │   │   ├── (infos)/         # route group: legal / informational pages
│   │   │   ├── bridge/, swap/   # core swap surfaces
│   │   │   ├── earn/, portfolio/, quests/, missions/, campaign/, zap/, scan/, onboard/
│   │   │   ├── error-preview/, meta/
│   │   │   ├── error.tsx, layout.tsx
│   │   ├── api/                 # Next.js route handlers (thin proxies to jumper-backend)
│   │   ├── lib/, ui/            # framework-level helpers
│   │   ├── layout.tsx, global.css, global-error.tsx, not-found.tsx, robots.ts, sitemap.xml/
│   ├── components/              # feature components (one folder per feature)
│   │   ├── core/, composite/, headless/   # primitives by composition level
│   │   ├── <FeatureName>/                 # e.g. EarnDetails, ConnectButton, Cards, …
│   ├── providers/               # provider tree: WalletProvider, ThemeProvider,
│   │                            # ReactQueryProvider, TranslationProvider, …
│   ├── stores/<feature>/        # zustand stores (one folder per feature)
│   ├── hooks/<feature>/         # react-query hooks + feature hooks
│   ├── config/                  # runtime config (env, wallet connectors, widget)
│   ├── i18n/translations/<lng>/ # translation JSON; resources.d.ts is generated
│   ├── theme/                   # MUI theme + design tokens
│   ├── const/, types/, utils/, fonts/, stories/
│   ├── Layout.tsx, proxy.ts
├── tests/                       # Playwright E2E + page objects + test data
├── public/                      # static assets
├── .storybook/                  # Storybook config
├── instrumentation.ts, instrumentation-client.ts, sentry.*.config.ts
├── next.config.mjs, vitest.config.ts, playwright.config.ts, eslint.config.mjs
├── gen-api.sh                   # regenerates the typed API client from jumper-backend's Swagger
```

## Request and data flow

```
       ┌─────────────────────────────────────────────────────────┐
       │ Browser (Next.js client)                                │
       │  ┌───────────────────────────────────────────────────┐  │
       │  │  React tree (App Router)                          │  │
       │  │   • providers/ wires query, wallet, theme, i18n   │  │
       │  │   • components/ render features                   │  │
       │  │   • stores/ hold client state (zustand)           │  │
       │  │   • hooks/ wrap react-query / wallet calls        │  │
       │  └─────────────┬─────────────────────────────────────┘  │
       └────────────────┼────────────────────────────────────────┘
                        │
        ┌───────────────┼─────────────────┐
        │               │                 │
        ▼               ▼                 ▼
  Next.js API     jumper-backend      LI.FI SDK
  routes          (REST,              (chains, quotes,
  (src/app/api/)  primary)            executions)
        │
        ▼
  jumper-backend (proxied)
                                  ┌─────────────────┐
                                  │  strapi-cms     │ ← legacy direct paths
                                  │  (REST)         │   (content + campaigns)
                                  └─────────────────┘
```

- **Server state** (chains, tokens, quotes, profile, campaigns, …) is fetched through react-query hooks under `src/hooks/`. Most go through `jumper-backend` either directly or via a Next.js route handler under `src/app/api/`. A few legacy hooks still call `strapi-cms` directly.
- **Client state** (selected chain/token, route choice, settings, theme, modals, …) lives in zustand stores under `src/stores/<feature>/`. Stores never call APIs — they hold UI state and derived selectors.
- **The swap engine** is `@jumperexchange/widget`. We embed it inside our pages and configure it via `src/config/widgetConfig.ts`. Wallet connectors are wired in `src/providers/WalletProvider/` so the widget sees them.
- **Sentry** is initialised once in `instrumentation*.ts` / `sentry.*.config.ts`. Feature code uses helpers — never `Sentry.init` directly.

## Internal dependency rules

| From → To      | components | hooks | stores | providers           | config | app/ | utils |
| -------------- | ---------- | ----- | ------ | ------------------- | ------ | ---- | ----- |
| **components** | ✓          | ✓     | ✓      | ✓ (consume context) | ✓      | ✗    | ✓     |
| **hooks**      | ✗          | ✓     | ✓      | ✓ (consume context) | ✓      | ✗    | ✓     |
| **stores**     | ✗          | ✗     | ✓      | ✗                   | ✓      | ✗    | ✓     |
| **providers**  | ✓ (render) | ✓     | ✓      | ✓                   | ✓      | ✗    | ✓     |
| **config**     | ✗          | ✗     | ✗      | ✗                   | ✓      | ✗    | ✓     |
| **app/**       | ✓          | ✓     | ✓      | ✓                   | ✓      | ✓    | ✓     |
| **utils**      | ✗          | ✗     | ✗      | ✗                   | ✗      | ✗    | ✓     |

Read as: a row module _may_ import from a column module where ✓; _must not_ where ✗.

Contribution Rules:

- **`utils/` is a leaf.** It must not import from anything else inside `src/`. Pure helpers only.
- **`stores/` does not import from `components/`, `hooks/`, or `providers/`.** Stores must be renderable in isolation (and unit-testable) without pulling in the whole tree.
- **`hooks/` does not import from `components/`.** Hooks describe data; components consume them.
- **Nothing inside `src/` imports from `src/app/`.** App routes are leaves of the dependency graph — they compose everything else.
- **No barrel `index.ts` files.** Import from source files directly. This keeps the dependency graph honest and tree-shakeable.

If a change requires reversing one of these directions, **stop**. The right shape is usually to move the shared code down a level (often into `utils/` or `config/`) rather than to invert the arrow.

## Invariants

| #   | Invariant                                                                      | Enforcement            |
| --- | ------------------------------------------------------------------------------ | ---------------------- |
| 1   | All user-facing pages live under `src/app/[lng]/`                              | doc; obvious on review |
| 2   | API route handlers in `src/app/api/` are thin proxies — no business logic      | doc                    |
| 3   | Server state goes through react-query; no direct `fetch` in components         | doc                    |
| 4   | One zustand store per feature folder under `src/stores/`                       | doc                    |
| 5   | No barrel files (`index.ts` re-exports)                                        | doc; ESLint candidate  |
| 6   | Sentry is initialised only in `instrumentation*.ts` / `sentry.*.config.ts`     | doc                    |
| 7   | Secrets never committed; new env vars documented in `src/config/env-config.ts` | per-repo CI (existing) |
| 8   | Pre-commit hook (`tsc --noEmit` + ESLint + Prettier) must pass                 | Husky + lint-staged    |

## Cross-repo position

- This app depends on `jumper-backend` (primary, via REST) and on `strapi-cms` (legacy direct paths, via REST).
- The TypeScript types of the backend API are vendored here, regenerated from `jumper-backend`'s Swagger via `pnpm api` (which calls `gen-api.sh`). Never hand-edit the generated file — change the upstream Swagger and regenerate.
