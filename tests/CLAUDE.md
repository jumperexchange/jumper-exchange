# tests/ — Claude Code context

See @README.md for prose explanations of the suite layout, run modes, and gotchas. This file is the agent-specific contract — decisions and rules, not tutorial.

## Core rules (do not break)

- **No mocks unless absolutely necessary.** Real wallet, real backend, real upstream. If you must mock, justify it in the PR description.
- **Treat `tests/e2e/wallet/` as load-bearing infrastructure** — the real-MetaMask driver framework. Bug fixes (popup detection, timing, sequencing) are in scope when a spec genuinely needs them; just don't casually refactor or restructure this code. Patterns may not be idiomatic for the rest of the repo — leave them unless changing them is the actual fix.
- **No barrel `index.ts` files.** Import directly from the source file. Matches AGENTS.md's whole-repo rule; no test-side exceptions.
- **Don't import `tests/` code into `src/`** or vice-versa.

## Suite layout

| Path                  | What it holds                                                   |
| --------------------- | --------------------------------------------------------------- |
| `tests/e2e/`          | Browser-driven Playwright specs that walk the Jumper UI         |
| `tests/e2e/pages/`    | Class-based POMs, one file per page/view                        |
| `tests/e2e/fixtures/` | Playwright test fixtures (wallet variants, etc.)                |
| `tests/e2e/data/`     | Shared constants, URL params, chain data, settings menu strings |
| `tests/e2e/utils/`    | Small reusable e2e helpers                                      |
| `tests/e2e/wallet/`   | Real-MetaMask driver framework — load-bearing, modify carefully |
| `tests/performance/`  | Cold-load LCP benchmarks (`pnpm test:perf:cold-lcp` only)       |

## Fixture selection

| Spec type                                                           | Use              |
| ------------------------------------------------------------------- | ---------------- |
| No wallet needed                                                    | `noWalletTest`   |
| Real wallet, no auto-connect (e.g. testing the connect flow itself) | `realWalletTest` |
| Real wallet, auto-connected to dApp before each test                | `connectedTest`  |

`connectedTest` auto-runs the connect flow via the `walletConnected` fixture. Each test gets a fresh `BrowserContext` and a fresh MetaMask onboarding; state does not leak between tests at the Playwright level.

## Where new things go

| New thing                       | Goes in                               |
| ------------------------------- | ------------------------------------- |
| New e2e spec                    | `tests/e2e/<feature>.spec.ts`         |
| New perf benchmark              | `tests/performance/<name>.spec.ts`    |
| New POM (class)                 | `tests/e2e/pages/<Name>Page.ts`       |
| New fixture                     | `tests/e2e/fixtures/<name>.ts`        |
| New shared constant / test data | `tests/e2e/data/<topic>.ts`           |
| New e2e test util               | `tests/e2e/utils/<topic>.ts`          |
| New perf util / config          | `tests/performance/utils/` or `data/` |

## Selector priority

`getByTestId` > `getByRole` > `getByLabel` > `getByText` > xpath (last resort).

If a stable testid doesn't exist on the FE element you need, leave a `TODO(app): <selector> needed for <reason>` comment so it can be batched into the team's stable-testids tracking ticket. Don't anchor on MUI internal class names (`MuiBadge-colorInfo`, `MuiIconButton-edgeStart`, etc.) — they drop without notice on major MUI bumps.

## Web-first assertions

Default to `await expect(locator).toBe…()` — Playwright auto-retries these until the matcher passes or the timeout fires.

**Sync getters do NOT retry:** `.count()`, `.textContent()`, `.getAttribute()`, `page.url()`, `.innerText()`, `.inputValue()`, `.isVisible()`. If their value drives an assertion, either:

- Wrap in `expect.poll(() => getter()).toBe(expected)` — retries the getter
- Use a web-first equivalent (`toHaveCount`, `toHaveText`, `toHaveAttribute`, `toContainText`, `waitForURL`)

Same for `evaluate(...)` reads of computed style / layout after a user action — wrap in `expect.poll` so the read retries against the post-transition DOM.

## Forbidden patterns

- ❌ `waitForTimeout(ms)` — only allowed with `// eslint-disable-next-line playwright/no-wait-for-timeout` + a one-line WHY comment
- ❌ `waitForLoadState('networkidle')` — flaky; use `domcontentloaded` + an element-visibility wait
- ❌ `{ force: true }` clicks — bypass actionability checks; only allowed with a documented reason
- ❌ Mocking the wallet, the backend, the LiFi SDK, or any upstream — unless a real call is truly impossible
- ❌ Silent skips — use `test.fixme(condition?, reason)` or `test.skip()` with a comment explaining the gating issue and pointing to a Linear ticket if applicable
- ❌ Test data with private addresses, seed phrases, or live API keys committed to `tests/.env.test` (shared defaults only); secrets go to gitignored `tests/.env.test.local`

## Test structure

- One Arrange / Act / Assert per `test.step`; keep steps small and named.
- POM methods are either **commands** (do an action, return `Promise<void>`) or **queries** (`expect…` methods that assert state). Don't combine — CQS keeps flakes localized.

## Run modes

| Command                                                                      | What it does                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm test`                                                                  | Full suite against local Next.js + `api-develop.jumper.exchange`                           |
| `BASE_URL=https://jumper.xyz pnpm test`                                      | Against prod                                                                               |
| `pnpm exec playwright test <spec> --workers=1`                               | Single spec, sequential                                                                    |
| `pnpm exec playwright test <spec> --repeat-each=N --trace=retain-on-failure` | Stress N times with traces preserved on failure                                            |
| `pnpm exec playwright test --workers=1 --output=test-results/run-X`          | Preserve traces across runs (default `test-results/` wipes between Playwright invocations) |

CI runs in shards via `.github/workflows/playwright.yml`; do not assume tests are isolated by file — they may be sharded across workers.

## Architectural gotchas

Evergreen patterns from how the framework is wired — these hold regardless of FE state:

- MetaMask connect popup is a **separate window** — use `wallet.connectInPopup(walletContext)`, not the original tab
- `prepareUserDataDir` auto-clears the MetaMask profile each test — never `rm -rf` manually
- `chromium.launchPersistentContext` does NOT inherit `use.baseURL` — `BrowserManager` passes it explicitly so pages from the wallet context can `goto("/")`

State-dependent traps (FE-version-specific, wallet-funding-dependent, etc.) are documented in README §"Common gotchas" and kept updated there — that's where to look when a previously-green test goes red without obvious reason.

## Linked docs

- `tests/README.md` — getting started, run modes, prose gotchas, state-dependent quirks
- `tests/.env.test` (committed defaults) + `tests/.env.test.local` (gitignored, per-developer)
- `../AGENTS.md` — whole-repo conventions
