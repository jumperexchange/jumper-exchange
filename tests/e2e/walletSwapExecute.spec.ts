import { qase } from 'playwright-qase-reporter';

import { buildUlParams } from './data';
import chainData from './data/chainData.json' with { type: 'json' };
import { connectedTest as test } from './fixtures';
import { LandingPage, WidgetPage } from './pages';

// Real on-chain swap on Arbitrum; one-way, consumes ~5 USDC per run.
// Funded wallet supports ~10 runs before USDC runs dry — refill via
// `lifinance/automate-wallet-dev-fees`.
test.describe('Wallet swap — execute on Arbitrum', () => {
  test(
    qase(205, 'Execute a USDC → USDT swap on Arbitrum end-to-end'),
    async ({ jumperPage, wallet, walletContext }) => {
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
        // LiFi may need 1 popup (permit/pre-approved) or 2 (approve + swap).
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
