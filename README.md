<div align="center">

[![license](https://img.shields.io/github/license/jumperexchange/jumper-exchange)](/LICENSE)
[![Crowdin](https://badges.crowdin.net/jumper-exchange/localized.svg)](https://crowdin.com/project/jumper-exchange)
[![Follow on Twitter](https://img.shields.io/twitter/follow/JumperExchange.svg?label=follow+Jumper.Exchange)](https://twitter.com/JumperExchange)

</div>

# Jumper.XYZ

This is the [jumper.xyz](https://jumper.xyz) repository that gets deployed to `develop.jumper.xyz`, `staging.jumper.xyz` and `jumper.xyz`.

For agents and contributors picking up work in this repo, start with [AGENTS.md](./AGENTS.md). The internal app shape and dependency rules are documented in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Getting Started

Requires Node 24+ (see `.nvmrc` — run `nvm use`).

```sh
pnpm install
pnpm dev            # or: pnpm dev:local | pnpm dev:staging | pnpm dev:production
```

## Error monitoring (Sentry)

- **Build**: provide `SENTRY_AUTH_TOKEN` and `NEXT_PUBLIC_SENTRY_DSN` via the same mechanism you use for the rest of the app (e.g. `.env` in CI, or the `ENV_FILE` used in a Docker build). The Dockerfile does **not** set Sentry variables, so they are not duplicated or overridden at the image layer; they must be present in that env when `pnpm build` runs for source map upload and a baked-in browser DSN.
- **Tuning (optional)**: `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE`, `SENTRY_TRACES_SAMPLE` (server/edge), `NEXT_PUBLIC_SENTRY_REPLAY_SESSION`, `NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR`, `NEXT_PUBLIC_SENTRY_ENABLE_LOGS`, `NEXT_PUBLIC_SENTRY_CONSOLE` — see [`src/sentry/sharedOptions.ts`](./src/sentry/sharedOptions.ts).
- **Spotlight (local dev)**: set `SENTRY_SPOTLIGHT=true` only when you run [Spotlight](https://spotlightjs.com) alongside the app; otherwise it is off to avoid failed requests and noisy warnings in the server log.
- **Vercel**: this repo may disable Sentry source map upload on Vercel to avoid build timeouts; see `sourcemaps` in `next.config.mjs`.

## Tools

- `pnpm api` — regenerate the backend-derived API client. Requires `jumper-backend` running on `localhost:3001`. Linting/formatting is handled separately by the usual commit/CI checks (or can be run manually).
- `pnpm typecheck` — run `tsc --noEmit`.
- `pnpm storybook` — Storybook on port 6006.
- `pnpm i18next-resources-for-ts` — regenerate typed i18n resources after editing `src/i18n/translations/en/`.

## Tests

- `pnpm test:unit` — Vitest unit tests (`<file>.spec.ts(x)`).
- `pnpm test:snapshots` — snapshot tests; regenerate with `pnpm test:snapshots:generate`.
- `pnpm test:storybook` — run stories under Vitest + Playwright.
- Playwright E2E: `pnpm test`, `pnpm test:e2e-real`, `pnpm test:qase`. First-time setup: `pnpm test:install`. See [tests/README.md](./tests/README.md).

## Lint and checks

[husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) run on commit (installed automatically by `pnpm install`).

`tsc --noEmit` is invoked from bash inside lint-staged — see [this issue](https://github.com/lint-staged/lint-staged/issues/825#issuecomment-674575655) for why.

## Contributing Translations

We appreciate your interest in helping translate our project!

If you'd like to contribute translations, please visit our Crowdin project page at [Crowdin Jumper Exchange](https://crowdin.com/project/jumper-exchange) and [Crowdin LI.FI Widget](https://crowdin.com/project/lifi-widget).
Register on Crowdin and you can start translating the project into your preferred language.
Your contributions will help make our project accessible to a wider audience around the world.

Thank you for your support!
