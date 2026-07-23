import chainData from './data/chainData.json' with { type: 'json' };
import { buildUrlParams } from './data/urlParams';
import { connectedTest as test } from './fixtures/connectedWallet';
import { LandingPage } from './pages/LandingPage';
import { WidgetPage } from './pages/WidgetPage';

// Real on-chain swap on Arbitrum; one-way, consumes ~5 USDC per run.
// Funded wallet supports ~10 runs before USDC runs dry — refill via
// `lifinance/automate-wallet-dev-fees`.
test.describe('Wallet swap — execute on Arbitrum', () => {
  // JUM-952: real-tx tests should not run on every PR CI. Re-enable once the
  // scheduled broadcast workflow (`playwright-broadcast.yml`) lands.
  test.fixme('Execute a USDC → USDT swap on Arbitrum end-to-end', async ({
    jumperPage,
    wallet,
    walletContext,
  }) => {
    test.setTimeout(300_000);

    const widgetPage = new WidgetPage(jumperPage);
    const landingPage = new LandingPage(jumperPage);
    const pair = chainData.ARBtoARB.USDCtoUSDT5;

    await test.step('Open swap deeplink and wait for route', async () => {
      await jumperPage.goto(`/${buildUrlParams(pair)}`);
      await landingPage.expectRoutesVisibility({
        bestReturnShouldBeVisible: true,
      });
    });

    await test.step('Review and start the swap', async () => {
      await widgetPage.clickReviewSwap();
      await widgetPage.clickStartSwapping();
    });

    await test.step('Sign first wallet popup (approval or swap)', async () => {
      await wallet.signPopup(walletContext);
    });

    await test.step('Sign swap signature if approval preceded it', async () => {
      await wallet.signPopupIfPresent(walletContext);
    });

    await test.step('Wait for swap completion', async () => {
      await widgetPage.expectSwapSuccessful(180_000);
    });
  });
});
