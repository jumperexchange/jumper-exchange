# AGENTS.md — jumper-exchange

## What this repo is

`jumper.exchange` — the Next.js frontend for [jumper.xyz](https://jumper.xyz). Talks primarily to `jumper-backend` over REST; some legacy paths still hit `strapi-cms` directly. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the app shape, route map, and dependency rules.

## Run, build, test

See @README.md

## Coding conventions

### Stack and idioms

- **Next.js 16 App Router** with locale segment `src/app/[lng]/…`. New pages go under `src/app/[lng]/<segment>/`; never under `src/app/` directly except for non-localized infrastructure (`api/`, `lib/`, root `layout.tsx`, etc.).
- **React 19** with the React Compiler enabled (see `babel-plugin-react-compiler`). Do not write manual `useMemo` / `useCallback` for cases the compiler handles; reach for them only when profiling shows it matters.
- **MUI v9 + Emotion** for styling. Prefer the `sx` prop or `styled()` over ad-hoc CSS modules. Theme tokens live under `src/theme/`.
- **State**: server state via `@tanstack/react-query`; client state via `zustand` stores under `src/stores/<feature>/`. Do not introduce a third state library.
- **Forms**: `@tanstack/react-form`.
- **i18n**: `next-i18n-router` + `i18next`. Translations under `src/i18n/translations/<lng>/`; regenerate the typed resources file with `pnpm i18next-resources-for-ts` after editing the `en` translation.
- **Wallet stack**: LI.FI SDK + widget, Wagmi/Viem for EVM, plus per-chain providers (Solana, Sui, Bitcoin, Tron). Wire new connectors through `src/providers/WalletProvider/` so the existing widget config picks them up.
- **API routes**: Next.js route handlers under `src/app/api/<name>/`. They proxy or wrap `jumper-backend`; do not put business logic here that belongs server-side.
- **Observability**: Sentry is wired via `instrumentation.ts`, `instrumentation-client.ts`, and `sentry.*.config.ts`. Use the existing helpers; do not call `Sentry.init` from feature code.

### Style rules

- **No barrel files** (`index.ts` re-exports). Import directly from the source file.
- **TypeScript path aliases**: `@/foo` and `src/foo` both resolve to `./src/foo` (see `tsconfig.json` and `vitest.config.ts`). Prefer `@/` in new code.
- **Delete replaced code.** No backwards-compatibility shims inside this repo; this is a feature-branch codebase.

### Tests

- **Unit tests** colocate as `<file>.spec.ts(x)` under `src/`. Vitest picks them up via the `unit` project.
- **Snapshot tests** colocate as `<file>.snapshot.spec.tsx`. Regenerate with `pnpm test:snapshots:generate` after intentional UI changes; review the diff before committing.
- **Storybook tests** run the stories in `.storybook/` against a Playwright-driven Chromium browser via the `storybook` Vitest project.
- **E2E tests** live in `tests/` (Playwright). One spec per top-level feature; helpers in `tests/utils/`. See [tests/README.md](./tests/README.md).
- **Hot paths get benchmarks**, not just unit tests. Measure before claiming faster.

## Entry points

Read these first when picking up new work in this repo:

- `src/app/[lng]/layout.tsx` — top-level locale layout; wires providers.
- `src/providers/` — provider tree (wallet, theme, query, i18n, intercom). Cross-cutting wiring lives here.
- `src/components/` — feature components grouped by feature (e.g. `Earn*`, `Portfolio*`, `Quests*`). Reusable primitives in `core/`, `composite/`, `headless/`.
- `src/stores/<feature>/` — zustand stores. One folder per feature; each owns its store, selectors, and types.
- `src/hooks/<feature>/` — react-query hooks and feature-specific hooks. Mirror the `src/stores/` layout.
- `src/app/api/` — Next.js route handlers (proxy + wrap `jumper-backend`).
- `src/config/` — runtime config (`config.ts`, `env-config.ts`, wallet connector configs, widget config).
- `next.config.mjs`, `instrumentation*.ts`, `sentry.*.config.ts` — framework + observability wiring.
- `tests/` — Playwright E2E suite.

## Where new things go

| New thing                        | Goes in                                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New page                         | `src/app/[lng]/<segment>/page.tsx` (+ `layout.tsx` if it has children)                                                                                      |
| New API route handler            | `src/app/api/<name>/route.ts`                                                                                                                               |
| New feature component            | `src/components/<FeatureName>/` (subfolder; one component per file, no barrels)                                                                             |
| New zustand store                | `src/stores/<feature>/`                                                                                                                                     |
| New react-query hook             | `src/hooks/<feature>/use<Thing>.ts`                                                                                                                         |
| New wallet connector             | `src/providers/WalletProvider/` + relevant `src/config/<connector>.ts`                                                                                      |
| New translation key              | `src/i18n/translations/en/<namespace>.json` then `pnpm i18next-resources-for-ts`                                                                            |
| New unit test                    | `<file>.spec.ts(x)` next to the source                                                                                                                      |
| New E2E test                     | `tests/<feature>.spec.ts`                                                                                                                                   |
| New theme token / palette change | `src/theme/`                                                                                                                                                |
| New env variable                 | `src/config/env-config.ts` + document in `.env.example`                                                                                                     |
| New canvas background scene      | `src/components/CanvasBackground/scenes/<id>/` — see [docs/workflows/canvas-background-scene/README.md](./docs/workflows/canvas-background-scene/README.md) |

If a change does not fit any of the above, stop and ask — do not invent a new top-level folder.

## What NOT to do

- **Do not** add backwards-compatibility shims, deprecation wrappers, or dead-code "for safety". Delete and replace.
- **Do not** add barrel `index.ts` files.
- **Do not** put business logic in `src/app/api/` route handlers — they are thin proxies to `jumper-backend`.
- **Do not** call `Sentry.init` outside the existing instrumentation files.
- **Do not** import `strapi-cms` content directly when an equivalent endpoint exists on `jumper-backend`. New CMS access should go through the backend.

## Doc index

- [README.md](./README.md) — getting started, tools, lint, translations.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — app shape, route map, dependency rules.
- [tests/README.md](./tests/README.md) — Playwright E2E setup and run commands.
- [docs/workflows/README.md](./docs/workflows/README.md) — task workflows (canvas backgrounds, etc.).

<!-- local overrides (gitignored) -->

@AGENTS.local.md
