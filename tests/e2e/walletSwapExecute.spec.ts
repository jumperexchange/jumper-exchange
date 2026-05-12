import { qase } from 'playwright-qase-reporter';

import { buildUlParams } from './data';
import chainData from './data/chainData.json' with { type: 'json' };
import { connectedTest as test } from './fixtures';
import { LandingPage, WidgetPage } from './pages';

// First broadcast-tx spec. Spends real funds on Arbitrum (~$0.20/run incl gas + slippage).
//
// Coverage: full swap-execute path — Review → Start → sign (approval and/or
// swap) → wait for "Swap successful". The widget's success state is the
// assertion; independent on-chain balance verification is a follow-up
// (would use RPC reads, not DOM parsing — per-token rows in the wallet
// drawer have no stable testids today).
//
// One-way swap: each run consumes 5 USDC and produces ~5 USDT (minus
// slippage/gas). The shared automation wallet (50 USDC starting balance)
// supports ~10 runs before USDC runs dry — at which point LiFi will fail
// route discovery for this pair and the test fails noisily. Refill via
// `lifinance/automate-wallet-dev-fees` when that happens, OR rebalance by
// swapping accumulated USDT back to USDC. Future improvement: make this
// spec round-trip so net consumption is just slippage+gas (~$0.20/run).
// Approval is one-time per (token, spender) pair, so first run pays ~$0.05
// extra gas; subsequent runs are cheaper.
//
// First successful run is the verification that the LiFi widget's role-by-name
// selectors (Review swap / Start swapping / Swap successful) match the
// rendered DOM. See `WidgetPage` for the assumptions and how to update them.
test.describe('Wallet swap — execute on Arbitrum', () => {
  test(
    qase(205, 'Execute a USDC → USDT swap on Arbitrum end-to-end'),
    async ({ jumperPage, wallet, walletContext }) => {
      // ~30s onboarding + ~30s route discovery + ~10s for Review/Start clicks
      // + 2×popup signing (up to 30s each) + Arb tx mining (~10s) + UI settle.
      test.setTimeout(300_000);

      const widgetPage = new WidgetPage(jumperPage);
      const landingPage = new LandingPage(jumperPage);
      const pair = chainData.ARBtoARB.USDCtoUSDT5;

      await test.step('Open swap deeplink and wait for route', async () => {
        await jumperPage.goto(`/${buildUlParams(pair)}`);
        await landingPage.expectRoutesVisibility({
          bestReturnShouldBeVisible: true,
        });
      });

      await test.step('Review and start the swap', async () => {
        await widgetPage.clickReviewSwap();
        await widgetPage.clickStartSwapping();
      });

      await test.step('Sign in MetaMask (approval and/or swap)', async () => {
        // LiFi route may require 1 popup (permit / pre-approved) or 2 (ERC-20
        // approve + swap). Sign the first unconditionally; if "Swap
        // successful" doesn't appear within 30s, sign the second.
        await wallet.signPopup(walletContext);
        try {
          await widgetPage.expectSwapSuccessful(30_000);
        } catch {
          await wallet.signPopup(walletContext);
        }
      });

      await test.step('Wait for swap completion', async () => {
        await widgetPage.expectSwapSuccessful(180_000);
      });
    },
  );
});
