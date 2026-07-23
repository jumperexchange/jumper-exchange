import chainData from './data/chainData.json' with { type: 'json' };
import { SETTINGS_MENU } from './data/settingsMenu';
import { buildUrlParams } from './data/urlParams';
import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { SettingsPage } from './pages/SettingsPage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';
[
  { name: 'Mobile', size: { height: 812, width: 375 } },
  { name: 'Desktop', size: { height: 1080, width: 1920 } },
].forEach(({ name, size }) => {
  test.describe(`On chain swaps [Viewport: ${name}]`, () => {
    // jscpd:ignore-start
    // Viewport-iteration mirrors settings.spec.ts.
    // Abstracting would obscure the per-spec viewport intent.
    test.use({ viewport: size });

    test.beforeEach(async ({ page }) => {
      const landingPage = new LandingPage(page);
      await seedWelcomeScreenClosed(page);
      await landingPage.goto();
    });
    // jscpd:ignore-end

    test('ETH chain swap pair', async ({ page }) => {
      await test.step('Check if the Relay fallback route is shown', async () => {
        const settings = new SettingsPage(page);
        const landingPage = new LandingPage(page);
        await settings.open(SETTINGS_MENU.TITLE);
        await settings.clickItem(SETTINGS_MENU.BRIDGES.LABEL);
        await settings.deselectAll();
        await settings.goBack();

        const pair = chainData.ETHtoETHswap.ETHtoETH;
        await page.goto(`/${buildUrlParams(pair)}`);
        await landingPage.expectSwapPairResolved(pair);
        await landingPage.expectRoutesVisibility({
          bestReturnShouldBeVisible: true,
          checkRelayRoute: true,
        });
      });
    });

    test('ARB chain swap pairs', async ({ page }) => {
      const landingPage = new LandingPage(page);

      await test.step(`Check ${chainData.ARBtoARB.ETHtoUSDT.tokenSymbol} to ${chainData.ARBtoARB.ETHtoUSDT.toTokenSymbol} swap pair`, async () => {
        const pair = chainData.ARBtoARB.ETHtoUSDT;
        await page.goto(`/${buildUrlParams(pair)}`);
        await landingPage.expectSwapPairResolved(pair);
        await landingPage.expectRoutesVisibility({
          bestReturnShouldBeVisible: true,
        });
      });

      await test.step(`Check ${chainData.ARBtoARB.USDCtoWBTC.tokenSymbol} to ${chainData.ARBtoARB.USDCtoWBTC.toTokenSymbol} swap pair`, async () => {
        const pair = chainData.ARBtoARB.USDCtoWBTC;
        await page.goto(`/${buildUrlParams(pair)}`);
        await landingPage.expectSwapPairResolved(pair);
        await landingPage.expectRoutesVisibility({
          bestReturnShouldBeVisible: true,
        });
      });
    });

    // Intermittent upstream: LiFi cross-VM Hypercore route discovery frequently exceeds
    // the 90s per-pair budget. Re-enable when LiFi SUI/SOL/BTC → Hypercore is consistently <90s.
    test.fixme('Hyperliquid chain swap pairs', async ({ page }) => {
      // Seven cross-VM Hypercore route lookups; LiFi can take 30-90s each.
      test.slow();
      const landingPage = new LandingPage(page);

      const swapPairs: Array<{
        label: string;
        params: Parameters<typeof buildUrlParams>[0];
      }> = [
        {
          label: `${chainData.EVMtoHypercore.ETHtoUSDC.tokenSymbol} → ${chainData.EVMtoHypercore.ETHtoUSDC.toTokenSymbol}`,
          params: chainData.EVMtoHypercore.ETHtoUSDC,
        },
        {
          label: `${chainData.ArbUSDCtoHypercore.USDCtoUSDC.tokenSymbol} → ${chainData.ArbUSDCtoHypercore.USDCtoUSDC.toTokenSymbol}`,
          params: chainData.ArbUSDCtoHypercore.USDCtoUSDC,
        },
        {
          label: `[NEGATIVE] ${chainData.ArbUSDCtoHypercore.USDCtoUSDC.tokenSymbol} → ${chainData.ArbUSDCtoHypercore.USDCtoUSDC.toTokenSymbol} below 5 USDC`,
          params: chainData.ArbUSDCtoHypercore.NegativeUSDCtoUSDC,
        },
        {
          label: `${chainData.BTCtoHypercore.BTCtoUSDC.tokenSymbol} → ${chainData.BTCtoHypercore.BTCtoUSDC.toTokenSymbol}`,
          params: chainData.BTCtoHypercore.BTCtoUSDC,
        },
        {
          label: `${chainData.SOLtoHypercore.SOLtoUSDC.tokenSymbol} → ${chainData.SOLtoHypercore.SOLtoUSDC.toTokenSymbol}`,
          params: chainData.SOLtoHypercore.SOLtoUSDC,
        },
        {
          label: `${chainData.SUItoHypercore.SUItoUSDC.tokenSymbol} → ${chainData.SUItoHypercore.SUItoUSDC.toTokenSymbol}`,
          params: chainData.SUItoHypercore.SUItoUSDC,
        },
      ];

      for (const { label, params } of swapPairs) {
        await test.step(`Check ${label} swap pair`, async () => {
          await page.goto(`/${buildUrlParams(params)}`);
          await landingPage.expectRoutesVisibility({
            bestReturnShouldBeVisible: true,
            // Cross-VM Hypercore pairs routinely take ~50s on LiFi; 90s headroom.
            timeoutMs: 90_000,
          });
        });
      }
    });
  });
});
