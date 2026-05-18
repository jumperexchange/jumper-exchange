# Dust position rendering

**Ticket**: [JUM-840](https://linear.app/lifi-linear/issue/JUM-840/display-dust-position-values-as-00001-instead-of-long-decimals)

## Decision

Token-amount strings in position UIs collapse any non-zero value below `0.0001` to `<0.0001 SYMBOL`. USD values in the same surfaces collapse any non-zero value below `$0.01` to `<$0.01`.

Numeric thresholds (`DUST_AMOUNT_THRESHOLD`, `DUST_USD_THRESHOLD`) live in `src/utils/formatNumbers.ts`. The collapsed labels are locale-aware: they are read from `src/i18n/translations/<lng>/translation.json` under `format.dustAmount` / `format.dustUsd` via the `i18next` singleton, with an en-US literal fallback when i18next hasn't been initialised yet (e.g. unit tests or very early startup).

`@lifi/widget`'s `compactNumberFormatter` (Unicode subscript notation, e.g. `0.0₁₇1 eETH`) was evaluated and rejected: it reads as a rendering bug rather than intentional formatting.

## Why

Dust positions otherwise render as `0.000000000000000001 eETH` or `$0.000000000000001`, which dominate the layout and are meaningless to users.

On the "0.0001 BTC ≈ €6" denomination concern: the token threshold is intentionally denomination-blind. The USD column always sits next to it and collapses below `$0.01`, giving the user a non-misleading anchor to interpret the row. A price-aware threshold can be revisited in a follow-up.

## Implementation

```mermaid
flowchart TD
  TokenConst["DUST_AMOUNT_THRESHOLD = 0.0001\nDUST_AMOUNT_LABEL\nin src/utils/formatNumbers.ts"]
  TokenHelper["formatTokenAmountWithDust(amount, symbol)\nin src/utils/formatNumbers.ts"]
  USDConst["DUST_USD_THRESHOLD = 0.01\nDUST_USD_LABEL\nin src/utils/formatNumbers.ts"]
  USDHelper["formatUSDWithDust(amountUSD)\nin src/utils/formatNumbers.ts"]
  TokenMethod["SimpleToken.formatTokenWithSymbol\nin src/utils/Token.ts"]
  USDMethod["ExtendedToken.formatAmountUSD\nin src/utils/Token.ts"]
  Earn["EarnDetailsActionsPosition\n(via formatAmount / formatAmountFromUSD / formatUSDWithDust)"]
  DeFi["DeFiPositionCard renderValueCell\nin src/components/composite/DeFiPositionCard/utils.tsx"]

  TokenConst --> TokenHelper
  USDConst --> USDHelper
  TokenHelper --> TokenMethod
  TokenMethod --> Earn
  USDHelper --> USDMethod
  USDMethod --> Earn
  USDHelper --> Earn
  TokenHelper --> DeFi
  USDHelper --> DeFi
```

## Boundary cases

### Token amounts

| Input                           | Output                                                               |
| ------------------------------- | -------------------------------------------------------------------- |
| `amount > 0 && amount < 0.0001` | `<0.0001 SYMBOL`                                                     |
| `amount === 0`                  | `0 SYMBOL` — zero semantics preserved (`formatZeroAmount` unchanged) |
| `amount >= 0.0001`              | `amount SYMBOL` — unchanged                                          |
| Missing / empty symbol          | `---` fallback — unchanged                                           |

### USD amounts

| Input              | Output                             |
| ------------------ | ---------------------------------- |
| `0.001` (sub-cent) | `<$0.01`                           |
| `0`                | `$0.00` — zero semantics preserved |
| `0.01` (boundary)  | `$0.01` — unchanged                |
| `12.34`            | `$12.34` — unchanged               |

## Out of scope

`PositionCard` / `TokenAmount` already caps display via `useTokenFormatters.toDisplayAmount` (`maximumFractionDigits: 3`), so it never produces a long-decimal dust string. Leaving it untouched keeps this change minimal.

The global `currencyFormatter` / `t('format.currency', ...)` path (NetworkCost, FeeBreakdownTooltip, etc.) is intentionally unchanged; collapsing applies only to position surfaces where sub-cent values are noise.
