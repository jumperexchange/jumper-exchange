# Jumper Playwright Tests

End-to-end automation for jumper-exchange. Browser-driven specs live in
`tests/e2e/`, run via the root `playwright.config.ts`.

## Quickstart

```sh
pnpm install
pnpm test:install                                  # one-time Playwright browsers
pnpm test                                          # run the full suite
```

For wallet-touching specs, create a gitignored `tests/.env.test.local`:

```sh
TEST_WALLET_SEED_PHRASE="word1 word2 ... word12"
TEST_WALLET_PASSWORD="..."
```

**Wallet funding requirements:**

- Most wallet specs work with a throwaway zero-funds wallet (connect, sign-message, switch-network, add-custom-network flows).
- `walletSwapExecute.spec.ts` executes a real on-chain swap on Arbitrum and consumes ~5 USDC per run. The wallet needs USDC + ETH for gas on Arb. Refill via `lifinance/automate-wallet-dev-fees`.
- Funded-wallet-gated specs (`walletSignPerkClaim`, `walletSignPerkClaimReject`, `walletMissionVerify`, `earnPage` user filters, `portfolioPage`) are currently `test.fixme()` pending shared funded wallet provisioning.

CI injects the same `TEST_WALLET_*` values from GitHub Actions secrets — the CI wallet must be the funded one for `walletSwapExecute.spec.ts` to pass.

**Why two files?** `tests/.env.test` is committed and holds shared defaults
(URLs, `NEXT_PUBLIC_*` keys, integrator IDs) — so a fresh clone has a working
test environment without anyone copying secrets around. `.env.test.local` is
gitignored and holds per-developer overrides (wallet seed, password). This is
the
[Next.js convention](https://nextjs.org/docs/app/guides/environment-variables#test-environment-variables)
for `.env*` files; `playwright.config.ts` loads `.env.test.local` with
`override: true` so local values win. CI injects wallet values from GitHub
Actions secrets directly.

### Common commands

```sh
pnpm test tests/e2e/landingPage.spec.ts            # one file
BASE_URL=https://jumper.xyz pnpm test              # against deployed prod

pnpm tsc:tests                                     # typecheck the tests package
pnpm exec eslint tests                             # lint
pnpm exec playwright test --list                   # discover specs
pnpm exec playwright show-report                   # open last HTML report
```

When `BASE_URL` is set the local dev server is skipped — Playwright runs
straight against the deployment.

### Performance (cold-load LCP)

Repeatable LCP benchmark for missions/earn **index** and **random detail** pages
(fresh browser context per sample). Slug pools are scraped once from the target
deployment’s list pages. **Excluded from `pnpm test`** via `testIgnore` in
`playwright.config.ts`; run with `pnpm test:perf:cold-lcp` (`playwright.perf.config.ts`).

**Prerequisite:** Playwright browsers must be installed once per machine (or after
a Playwright version bump):

```sh
pnpm test:install
```

```sh
# Local: perf config boots `pnpm build && pnpm start` (ISR / server cache)
pnpm test:perf:cold-lcp

# Deployed target (skips local webServer)
BASE_URL=https://develop.jumper.xyz PERF_SAMPLES=20 pnpm test:perf:cold-lcp

# More detail samples + reproducible random slugs
PERF_DETAIL_SAMPLES=15 PERF_RANDOM_SEED=42 pnpm test:perf:cold-lcp

# Optional fixed detail slugs (in addition to random detail tests)
PERF_MISSION_SLUG=my-mission PERF_EARN_SLUG=some-vault PERF_P95_BUDGET_MS=5000 pnpm test:perf:cold-lcp
```

| Env                        | Default                | Purpose                                       |
| -------------------------- | ---------------------- | --------------------------------------------- |
| `PERF_SAMPLES`             | `10`                   | Cold iterations per **index** route           |
| `PERF_DETAIL_SAMPLES`      | same as `PERF_SAMPLES` | Cold iterations per **random detail** route   |
| `PERF_DISCOVER_SLUG_LIMIT` | `50`                   | Max slugs scraped into each pool              |
| `PERF_RANDOM_SEED`         | —                      | Fixed seed for reproducible random slug picks |
| `PERF_LOCALE`              | `en`                   | Locale prefix in URLs (e.g. `/en/missions`)   |
| `PERF_MISSION_SLUG`        | —                      | Extra fixed `/en/missions/{slug}` benchmark   |
| `PERF_EARN_SLUG`           | —                      | Extra fixed `/en/earn/{slug}` benchmark       |
| `PERF_P95_BUDGET_MS`       | —                      | Optional assert on p95 (ms)                   |

Spec: `tests/performance/coldLoadLcp.spec.ts`. Filter with `--grep @performance`.

### Run modes

| Mode                 | Command                                         | Frontend                                                               | Backend                                                                   | SSO gate                        |
| -------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| **CI parity**        | `pnpm test` (no `BASE_URL`)                     | local Next.js on `:3000` (Playwright `webServer` boots `pnpm run dev`) | develop API (`api-develop.jumper.exchange`) — read from `tests/.env.test` | none (perf specs excluded)      |
| **Perf cold LCP**    | `pnpm test:perf:cold-lcp`                       | `pnpm build && pnpm start` unless `BASE_URL` set                       | same as target URL                                                        | none                            |
| **Prod smoke**       | `BASE_URL=https://jumper.xyz pnpm test`         | prod                                                                   | prod                                                                      | none                            |
| **Deployed develop** | `BASE_URL=https://develop.jumper.xyz pnpm test` | develop deployed                                                       | develop API                                                               | **YES — Cloudflare Access SSO** |

CI never accesses `develop.jumper.xyz` — it boots local `pnpm dev` on the runner and points at `api-develop.jumper.exchange`. The Cloudflare Access SSO gate is on the deployed develop frontend only.

### CI reports

Each CI run publishes its HTML report to GitHub Pages under a per-PR, per-run
path (`pr-<n>/<date>-<run>-<attempt>/`), so re-runs and parallel PRs never
overwrite each other. The PR gets a sticky comment linking that report. Traces
are stripped from the published page (public site — see JUM-1235), so for
failure debugging use the full report artifact (`html-report`, kept 4 days)
from the run's **Actions** page. It is encrypted at rest (AES-256 zip) —
artifact download on a public repo is open to any logged-in GitHub account,
and the full traces carry network bodies and DOM snapshots. To open it:

1. Download and unzip the artifact — inside is `playwright-report.zip`.
2. Double-click it (macOS Archive Utility handles AES zips) and paste the
   passphrase: `PLAYWRIGHT_REPORT_ENCRYPTION_KEY`, from 1Password
   (Developers vault).
3. `npx playwright show-report playwright-report`

Or from the terminal:

```sh
unzip html-report--attempt-1.zip
7zz x -p'<passphrase>' playwright-report.zip   # 7zz: brew install sevenzip (plain unzip can't do AES)
npx playwright show-report playwright-report
```

A daily cron prunes report dirs older than `RETENTION_DAYS` and squashes the
`gh-pages` history.

## Layout

```
tests/
├── e2e/
│   ├── data/        # typed constants — URLs, settings labels, theme RGBs, wallet options
│   ├── pages/       # class-based POMs (one per page area)
│   ├── fixtures/    # noWallet / realWallet / connectedWallet
│   ├── wallet/      # real-MetaMask driver framework (load-bearing)
│   ├── utils/       # navigationUtils and other e2e helpers
│   └── *.spec.ts
├── performance/     # cold-load LCP benchmarks (not in `pnpm test`)
│   ├── data/        # perfConfig, routePaths (missionsEarnPaths)
│   ├── utils/       # measureLcp, perfRandom
│   └── coldLoadLcp.spec.ts, ColdLcpBenchmark, …
└── tsconfig.json
```

`tests/e2e/data/index.ts` is the public barrel — specs import constants and
`buildUlParams` from `./data` rather than reaching into individual files.

## Fixtures

Every spec picks one of three fixtures, exported from
`tests/e2e/fixtures/index.ts`:

| Fixture          | When to use                                                                                                                        | What you get                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `noWalletTest`   | UI/DOM assertions that don't depend on a connected wallet (landing, theme, settings, mobile viewport, swap-route URLs, meta tags). | Plain Playwright `test`. Fast — no extension load.                                                                                   |
| `realWalletTest` | The connect/disconnect flow itself, or any test that wants the wallet present but not yet connected.                               | A `wallet: MetaMaskPage` fixture pre-imported with the test seed.                                                                    |
| `connectedTest`  | Anything that needs the wallet already connected to Jumper (portfolio, earn user filters, profile, leaderboard).                   | `wallet`, `walletContext`, `jumperPage`, `landingPage`, `connectWalletPage` — and the connect step is auto-run before the test body. |

Specs alias on import:

```ts
import { noWalletTest as test, expect } from './fixtures';
```

`realWalletTest` and `connectedTest` follow the same pattern. **One fixture per
spec file** — the Playwright lint plugin flags expects on `connectedTest(...)`
calls when another `test` alias coexists in the file.

## Real wallet, not mocks

Wallet-touching tests run against a real MetaMask extension loaded via
`chromium.launchPersistentContext` — no `window.ethereum` injection, no
selective RPC stubbing. The framework lives under `tests/e2e/wallet/`,
adapted from a separate QA framework.

The MetaMask zip is pulled from a pinned GitHub release on first run
(`tests/e2e/wallet/constants/extensionConstants.ts`, version 13.16.0). The
extracted extension is cached at the repo-root `extensions/metamask/` directory (gitignored).
Each Playwright worker gets its own Chromium profile under `user_data/` so
parallel execution doesn't share extension state.

External services (LiFi `/tasks_verification`, jumper-backend `/perks/claim`,
etc.) are exercised live. A failure caused by an upstream regression is the
test doing its job, not flake to mask.

## Writing tests

Pick a fixture, then follow the pattern that matches it.

### Adding a new POM

1. Create `tests/e2e/pages/MyPage.ts` as a class. Locators in the constructor,
   action methods first, `expectX` assertions second. No deep inheritance.
2. Re-export from `tests/e2e/pages/index.ts` so specs can import from the
   barrel.
3. Selector priority: `data-testid` → `id` → `aria-label` → `getByRole` →
   `getByText` (with `{ exact: true }` for matches that should be specific).
   Avoid CSS-class selectors and structural xpath. When the app needs a new
   `data-testid`, leave a `// TODO(app): JUM-924 — …` comment and continue
   with the stablest available selector.
4. No magic literals. Promote any user-facing string the spec asserts on to a
   constant in `tests/e2e/data/`.

### Adding a new spec

1. Decide which fixture you need:
   - `noWalletTest` — UI/DOM assertions only, no wallet
   - `realWalletTest` — wallet present but not connected (e.g. testing the connect flow itself, or MetaMask-only flows like `walletAddCustomNetwork`)
   - `connectedTest` — wallet auto-connected to Jumper (e.g. profile, portfolio, perks flows)
2. Create `tests/e2e/myFlow.spec.ts`. Import the fixture as `test`:
   ```ts
   import { connectedTest as test, expect } from './fixtures';
   ```
3. For wallet-popup interactions use:
   - `wallet.connectInPopup(walletContext)` — approves the connect popup
   - `wallet.signPopup(walletContext)` — approves a sign-typed-data / message signature
   - `wallet.rejectPopup(walletContext)` — rejects whatever popup is open
   - `wallet.switchNetworkFromPopup(walletContext)` — approves a `wallet_switchEthereumChain` request
4. Before pushing:
   ```sh
   pnpm tsc:tests
   pnpm exec eslint tests --max-warnings=0
   BASE_URL=https://jumper.xyz pnpm exec playwright test tests/e2e/myFlow.spec.ts --workers=1
   ```

## Coding standards

Mechanical rules (TS strict, no `any` / `!` without why, perfectionist sort, playwright-plugin rules, prettier formatting, jscpd dupcheck) are enforced by `eslint.config.mjs` + `tests/tsconfig.json` + husky `pre-commit`. The cultural rules below are review-enforced:

**Principles.** KISS · YAGNI · Minimal Viable Change · Boy Scout Rule · Readability over cleverness.

**TypeScript.** Strict mode on. Explicit return types on exported functions and POM methods. Constants in `SCREAMING_SNAKE_CASE`, centralized in `tests/e2e/data/`. Single-file types co-located with their owner; promote to a shared location only when used in 2+ files.

**ESLint + Prettier.** Flat config + `eslint-plugin-playwright` + `eslint-plugin-perfectionist`. Husky `pre-commit` runs `tsc --noEmit + eslint --fix + prettier --write` on staged files. **Prettier runs standalone, not as an ESLint plugin** — `eslint-config-prettier` disables conflicting rules; don't introduce `eslint-plugin-prettier`.

**Functions and methods.** **SLAP** (Single Level of Abstraction): one level per body. **CQS** (Command-Query Separation): a method either changes state or returns a value, not both. Pure functions where possible. If reading a function requires scrolling, split it.

**Page Object Model.** **SRP** (one POM = one page area, class-based). Locators in the constructor; action methods first, `expectX` assertions second. **Composition over inheritance.** **Single entry point** — import from `tests/e2e/{pages,data}/index.ts`, don't reach into internals from specs. **Law of Demeter** — specs talk to POMs, not POM internals. **Encapsulation** — internals stay private. **Selector priority**: `data-testid` → `id` → `aria-label` → `getByRole` → `getByText` with `{ exact: true }`. Missing app-side testids → `// TODO(app): JUM-924 — …` comment. **No magic literals** — promote to `tests/e2e/data/` constants.

**Test design.** **AAA** (Arrange → Act → Assert) every time. **Hermetic tests** — fully self-contained, no shared state, no execution-order dependencies. **Assert What You Mean** — `expect(status).toBe(400)`, not `toBeGreaterThanOrEqual(400)`. **Flakiness is a bug** — quarantine with `test.fixme()` + a written reason + a tracked Linear ticket. Never retry-and-shrug.

**Error handling.** Never swallow errors silently. **Fail Fast** — fixture setup throws when env is wrong. **Fail with meaning** — error messages describe what went wrong and where. **Diagnose root cause, not symptoms** — patches that mask symptoms are debt.

**Comments.** Default to none. Add only when _why_ is non-obvious (workaround, hidden invariant, surprising behavior). Document intent, not mechanics. No commented-out code in committed work.

**Before claiming done.** IDE diagnostics, `pnpm tsc:tests`, `pnpm exec eslint tests --max-warnings=0`, `pnpm dupcheck:tests`. For substantive changes, run the affected specs locally — don't rely solely on CI.

**What NOT to do.** Add unrequested features or "future-proofing." Modify files outside the agreed scope without asking. Run Prettier as an ESLint plugin.

## Common gotchas

- **Dev server wedges.** Turbopack can lock up on heavy module compilations and consume 4+ GB. If a run hangs at "injected env" with no further output, kill the next-server process tree and re-run, OR pass `BASE_URL=https://jumper.xyz` to skip the local dev server entirely.
- **`prepareUserDataDir` auto-wipes per worker.** No manual `rm -rf tests/e2e/wallet/user_data/` needed between runs. The framework clears + recreates the per-worker dir on every launch — that's why each wallet-touching spec pays the ~30s onboarding cost.
- **First wallet-touching run downloads MetaMask.** ~10 MB, ~15s, on first run only. Cached at the repo-root `extensions/metamask/` directory (gitignored) for subsequent runs. If the cache gets corrupt or the framework's pinned version changes, the next run re-extracts automatically (manifest-version mismatch invalidates the cache).
- **Wallet secrets live in `tests/.env.test.local` (gitignored), not `.env.test`.** `.env.test` is committed per [Next.js convention](https://nextjs.org/docs/app/guides/environment-variables#test-environment-variables) with shared defaults; per-developer secrets go in `.env.test.local`. CI injects from GitHub Actions secrets.
- **Marketing pages cross-host to `jumper.xyz`.** Privacy / Terms / Newsletter / Scan navigate to `jumper.xyz`; URL assertions must be host-agnostic regex.

## Tools

**VS Code.** Install the official "Playwright Test for VSCode" extension. Run/debug individual tests from the Test sidebar. The extension picks up `playwright.config.ts` automatically.
