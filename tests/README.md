# Jumper Playwright Tests

End-to-end automation for jumper-exchange. Two test surfaces:

| Path         | Purpose                                                     |
| ------------ | ----------------------------------------------------------- |
| `tests/e2e/` | Browser-driven specs that walk the Jumper UI.               |
| `tests/api/` | Request-only specs that hit JSON/JS endpoints (no browser). |

Both surfaces run under one Playwright config (`../playwright.config.ts`); the
split is by spec location, not by test runner.

## Layout

```
tests/
├── e2e/
│   ├── data/        # typed constants — URLs, settings labels, theme RGBs, wallet options
│   ├── pages/       # class-based POMs (one per page area)
│   ├── fixtures/    # noWallet / realWallet / connectedWallet
│   ├── wallet/      # vendored MetaMask driver framework
│   ├── utils/       # tiny helpers (translation strip, viewport math)
│   └── *.spec.ts
├── api/
│   ├── fixtures.ts  # re-exports { test, expect } so api specs share an import shape
│   └── *.spec.ts
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
extracted extension is cached under `tests/e2e/wallet/extensions/metamask/`.
Each Playwright worker gets its own Chromium profile under `user_data/` so
parallel execution doesn't share extension state.

External services (LiFi `/tasks_verification`, jumper-backend `/perks/claim`,
etc.) are exercised live. A failure caused by an upstream regression is the
test doing its job, not flake to mask.

## Required env

Wallet-touching specs need a throwaway test mnemonic (zero funds, never reuse
on mainnet) plus the wallet password. Locally, copy `.env.test.example` →
`.env.test` and fill in:

```sh
TEST_WALLET_SEED_PHRASE="word1 word2 ... word12"
TEST_WALLET_PASSWORD="..."
```

CI injects the same values from secrets.

`tests/.env.test` is gitignored. If you see it tracked locally, do not commit.

## Running

```sh
pnpm install
pnpm test:install                                  # one-time Playwright browsers

pnpm test                                          # full suite (boots local dev server)
pnpm test tests/e2e/landingPage.spec.ts            # one file
BASE_URL=https://jumper.xyz pnpm test              # against deployed prod
BASE_URL=https://develop.jumper.xyz pnpm test      # develop (gated by Cloudflare Access)
# `jumper.exchange` redirects to `jumper.xyz`; pass `.xyz` directly to skip the hop.

pnpm tsc:tests                                     # typecheck the tests package
pnpm exec eslint tests                             # lint
pnpm exec playwright test --list                   # discover specs without running
pnpm exec playwright show-report                   # open last HTML report

pnpm test:qase                                     # full suite with Qase reporter
```

When `BASE_URL` is set the local dev server is skipped — Playwright runs
straight against the deployment.

## Run modes (which combo reproduces what)

| Mode                 | Command                                         | Frontend                                                               | Backend                                                                   | SSO gate                                                                                                   | Reproduces                                   |
| -------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **CI parity**        | `pnpm test` (no `BASE_URL`)                     | local Next.js on `:3000` (Playwright `webServer` boots `pnpm run dev`) | develop API (`api-develop.jumper.exchange`) — read from `tests/.env.test` | none                                                                                                       | what `.github/workflows/playwright.yml` runs |
| **Prod smoke**       | `BASE_URL=https://jumper.xyz pnpm test`         | prod                                                                   | prod                                                                      | none                                                                                                       | smoke against deployed prod                  |
| **Deployed develop** | `BASE_URL=https://develop.jumper.xyz pnpm test` | develop deployed                                                       | develop API                                                               | **YES — Cloudflare Access SSO** blocks all programmatic traffic without a service token / cookie injection | rarely needed; almost never the right move   |

CI never accesses `develop.jumper.xyz` — it boots local `pnpm dev` on the runner and points at `api-develop.jumper.exchange`. The Cloudflare Access SSO gate is on the deployed develop frontend only.

## Common gotchas

- **Dev server wedges.** Turbopack can lock up on heavy module compilations and consume 4+ GB. If a run hangs at "injected env" with no further output, kill the next-server process tree and re-run, OR pass `BASE_URL=https://jumper.xyz` to skip the local dev server entirely.
- **`prepareUserDataDir` auto-wipes per worker.** No manual `rm -rf tests/e2e/wallet/user_data/` needed between runs. The framework clears + recreates the per-worker dir on every launch — that's why each wallet-touching spec pays the ~30s onboarding cost.
- **First wallet-touching run downloads MetaMask.** ~10 MB, ~15s, on first run only. Cached at `tests/e2e/wallet/extensions/metamask/` for subsequent runs. If the cache gets corrupt, delete that directory.
- **`tests/.env.test` is gitignored.** Contains the throwaway test seed phrase and password. CI injects from secrets. If you find it tracked locally, do NOT commit.
- **MUI major bumps drop auto-`data-testid`s.** PR #2814 (MUI v7→v9) silently broke specs anchored on `WarningRoundedIcon`, `ArrowBackIcon` etc. Anchor on app-side testids or accessible names — see [JUM-924](https://linear.app/lifi-linear/issue/JUM-924) for the consolidated app-side testid request.
- **Marketing pages cross-host to `jumper.xyz`.** Privacy / Terms / Newsletter / Scan navigate to `jumper.xyz`; URL assertions must be host-agnostic regex.

## Adding a new POM

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

## Adding a new wallet test

Wallet-touching specs use `realWalletTest` (just the wallet, not yet connected) or `connectedTest` (auto-connected to Jumper). One fixture per spec file.

1. Decide which fixture you need:
   - `noWalletTest` — UI/DOM assertions only, no wallet
   - `realWalletTest` — wallet present but not connected (e.g. testing the connect flow itself, or MetaMask-only flows like `walletAddCustomNetwork`)
   - `connectedTest` — wallet auto-connected to Jumper (e.g. profile, portfolio, perks flows)
2. Create `tests/e2e/myWalletFlow.spec.ts`. Import the fixture as `test`:
   ```ts
   import { connectedTest as test, expect } from './fixtures';
   ```
3. Wrap each `test()` body in `qase(N, "title")` where `N` is a unique TestOps ID. Don't reuse IDs from existing specs — `pnpm exec playwright test --list | grep "Qase ID"` shows the current set.
4. For wallet-popup interactions use:
   - `wallet.connectInPopup(walletContext)` — approves the connect popup
   - `wallet.signPopup(walletContext)` — approves a sign-typed-data / message signature
   - `wallet.rejectPopup(walletContext)` — rejects whatever popup is open
   - `wallet.switchNetworkFromPopup(walletContext)` — approves a `wallet_switchEthereumChain` request
5. Specs that need a funded wallet (real on-chain tx) must check `TEST_WALLET_FUNDED_SEED_PHRASE`/`PASSWORD` env vars before running. The unfunded wallet at `TEST_WALLET_SEED_PHRASE` must NEVER be used for funded flows.
6. After writing, run locally before pushing:
   ```sh
   pnpm tsc:tests
   pnpm exec eslint tests --max-warnings=0
   BASE_URL=https://jumper.xyz pnpm exec playwright test tests/e2e/myWalletFlow.spec.ts --workers=1
   ```

## Coding standards

Conventions enforced (or aspired to) for everything under `tests/`. Pair with the human-side review and the CI gates in `.github/workflows/playwright.yml` and `.github/workflows/checks.yml`.

**General principles**

- **KISS.** Start with the simplest solution that works. Add complexity only when something forces it.
- **YAGNI.** Don't add features, abstractions, or "future-proofing" that weren't explicitly asked for.
- **Minimal Viable Change.** The smallest change that achieves the goal. No scope creep.
- **Boy Scout Rule.** Leave touched files cleaner than you found them — fix obvious nearby issues.
- **Readability over cleverness.** Write for the next person. If a line needs a comment to be understood, rewrite the line first.

**TypeScript**

- Strict mode on via `tests/tsconfig.json`. Lint/type errors are bugs, not noise.
- No `any` without a comment explaining why (`@typescript-eslint/no-explicit-any: error`).
- No non-null assertions (`!`) without a comment explaining why (`@typescript-eslint/no-non-null-assertion: error`). Prefer real null checks.
- `import type` for all type-only imports (`@typescript-eslint/consistent-type-imports`).
- Prefix intentionally-unused parameters with `_` (e.g. `prepareUserDataDir(dir, _useParallel)`). The lint rule `no-unused-vars` is configured with `argsIgnorePattern: "^_"`.
- Explicit return types on exported functions and POM methods.
- **Type co-location with nuance.** Single-file types stay co-located with their owner. Types crossing module boundaries (used in 2+ files) move to a shared location — currently inline barrels under `tests/e2e/data/` for now; introduce `tests/e2e/types/` when shared types accumulate.
- Constants in `SCREAMING_SNAKE_CASE`; centralized in `tests/e2e/data/`.

**ESLint + Prettier**

- ESLint flat config: `eslint-plugin-playwright` rules tuned for Qase wrappers, `eslint-plugin-perfectionist` (`recommended-natural`) for sort/import ordering (tests-only scope).
- Prettier runs as a standalone tool — never as an ESLint plugin. `eslint-config-prettier` disables conflicting rules.
- Formatting enforced via repo-wide husky `pre-commit` + `lint-staged` (`tsc --noEmit + eslint --fix + prettier --write` on staged TS/JS).
- Don't disable lint rules ad-hoc. If a rule is wrong for a case, the disable comment must include a one-line _why_.

**Functions and methods**

- **SLAP** (Single Level of Abstraction): each function operates at one level of detail. Don't mix high-level orchestration with low-level implementation in the same body.
- **CQS** (Command-Query Separation): a method either changes state or returns a value — not both. POM action methods don't double as assertion sources.
- Pure functions where possible (same input → same output, no side effects). Side-effecting code stays explicit and isolated.
- Keep functions short and focused. If reading a single function requires scrolling, split it.

**Page Object Model**

- **SRP.** One POM = one page area. Class-based, in `tests/e2e/pages/`.
- Locators in the constructor; action methods first; `expectX` assertions second.
- **Composition over inheritance.** Build behaviour by combining small focused helpers, not deep class hierarchies.
- **Single entry point.** Import POMs and constants from `tests/e2e/pages/index.ts` and `tests/e2e/data/index.ts`. Don't reach into individual internal files from specs.
- **Law of Demeter.** Specs talk to POMs, not to POM internals. Don't chain through `pomA.pomB.locator.foo`.
- **Encapsulation.** Internals stay private. If something doesn't need to be public, it isn't.
- Selector priority (top to bottom): `data-testid` → `id` → `aria-label` → `getByRole` → `getByText` with `{ exact: true }`. Avoid CSS classes and structural xpath. Missing app-side testids → `// TODO(app): …` comment.
- No magic literals. Promote any user-facing string a spec asserts on to a constant in `tests/e2e/data/`. Build URL params via `buildUlParams`, not string concatenation.

**Tests-specific principles**

- **AAA.** Arrange → Act → Assert. Every test, every time.
- **Hermetic tests.** Each test fully self-contained. No shared state, no reliance on execution order. Per-worker `user_data` dirs already enforce this for wallet state.
- **Test Data Isolation.** Set up and tear down explicitly. Test data must not bleed between specs or between local/CI runs.
- **Assert What You Mean.** Specific expected values: `expect(status).toBe(400)` not `expect(status).toBeGreaterThanOrEqual(400)`. Broad assertions are a quality smell.
- **Flakiness is a bug.** A flaky test is broken, not "sometimes passing." Quarantine with `test.fixme()` + a written reason, file the bug, fix root cause — never retry-and-shrug.
- **First-Class Tests.** Test code is held to the same quality bar as production code. No shortcuts in naming, structure, or clarity.
- **Contract tests** for API surfaces (`tests/api/`). Verify schemas and interfaces stay stable.
- **Stable selectors** (UI/E2E). Already covered above; never CSS classes, never DOM-structure xpath.

**Error handling**

- **Never swallow errors silently.** Catch blocks must log enough context to trace what happened. `.catch(() => {})` requires a comment explaining why the error is intentionally ignored (e.g. `bringToFront` race).
- **Fail Fast.** Fixture setup fails loud if env is wrong (`TEST_WALLET_SEED_PHRASE` missing → throw, don't produce a mysterious test failure 30s later).
- **Fail with meaning.** Error messages describe what went wrong and where, not just that something went wrong.
- **Diagnose root cause, not symptoms.** When a test fails, identify what actually caused it. A patch that masks the symptom is debt.

**Comments**

- Default to none. Add only when _why_ is non-obvious (workaround for a specific bug, hidden invariant, surprising behavior).
- Document intent, not mechanics. If you're explaining _what_ the code does, rename things first.
- No commented-out code or stale TODOs in committed work.

**Post-edit checks (mandatory before claiming done)**

- IDE diagnostics first (LSP errors/warnings).
- `pnpm tsc:tests` and `pnpm exec eslint tests` — no errors, no new warnings.
- `pnpm dupcheck:tests` (jscpd) — no duplication regressions. (Script: `npx jscpd tests/e2e --min-lines 5 --min-tokens 50`. Add to `package.json` if missing.)
- For substantive changes: run the affected specs locally, not just rely on CI.

**Real-world default**

- Real wallet, real backend, real upstream. Mocks are a last resort with a written reason. See _Real wallet, not mocks_ above.

**Code quality signals — flag these proactively when you see them**

- Inline literal values with no name (magic numbers/strings).
- Functions doing more than one thing.
- Imports bypassing the `index.ts` barrel.
- Use of `any` or `!` without a why-comment.
- Tests with shared mutable state or implicit ordering.
- Assertions that don't fully specify the expected outcome.
- Deep inheritance chains (suggest composition).
- Comments explaining _what_ code does rather than _why_.
- New features or abstractions that weren't explicitly requested (YAGNI).
- Catch blocks without context.

**What NOT to do**

- Don't add unrequested features, abstractions, or "future-proofing."
- Don't modify files outside the agreed scope without asking.
- Don't include `Co-Authored-By: Claude` or any AI attribution in commits.
- Don't leave debug `console.log` or commented-out code in committed work.
- Don't run Prettier as an ESLint plugin (`eslint-plugin-prettier`). They run as separate tools.

## Qase

Every `test()` is wrapped in `qase(N, "title")`. The numeric ID is the link
to TestOps; do not change it when moving or renaming a spec.

```sh
export QASE_TESTOPS_API_TOKEN="..."   # from 1Password (QA dept)
pnpm test:qase
```

## VS Code

Install the official "Playwright Test for VSCode" extension. Run/debug
individual tests from the Test sidebar. The extension picks up
`playwright.config.ts` automatically.
