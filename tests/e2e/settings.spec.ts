import { qase } from 'playwright-qase-reporter';

import { SETTINGS_MENU } from './data/settingsMenu';
import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { SettingsPage } from './pages/SettingsPage';
for (const { name, size } of [
  { name: 'Mobile', size: { height: 812, width: 375 } },
  { name: 'Desktop', size: { height: 1080, width: 1920 } },
]) {
  test.describe(`Settings menu [Viewport: ${name}]`, () => {
    // jscpd:ignore-start
    // Viewport-iteration mirrors swapActions.spec.ts.
    // Abstracting would obscure the per-spec viewport intent.
    test.use({ viewport: size });

    test.beforeEach(async ({ page }) => {
      const landingPage = new LandingPage(page);
      await landingPage.goto();
      await landingPage.closeWelcomeScreen();
    });
    // jscpd:ignore-end

    test(
      qase(
        name === 'Mobile' ? 7 : 8,
        'Should verify all settings menu functionality',
      ),
      async ({ page }) => {
        const settings = new SettingsPage(page);

        await test.step('Open settings menu', async () => {
          await settings.open(SETTINGS_MENU.TITLE);
        });

        await test.step('Verify route priority options', async () => {
          await settings.clickItem(SETTINGS_MENU.ROUTE_PRIORITY.LABEL);
          await settings.expectItem(SETTINGS_MENU.ROUTE_PRIORITY.BEST_RETURN, {
            enabled: true,
          });
          await settings.expectItem(SETTINGS_MENU.ROUTE_PRIORITY.FASTEST, {
            visible: true,
          });

          await settings.clickItem(SETTINGS_MENU.ROUTE_PRIORITY.FASTEST);
          await settings.clickItem(SETTINGS_MENU.ROUTE_PRIORITY.LABEL);
          await settings.expectItem(SETTINGS_MENU.ROUTE_PRIORITY.FASTEST, {
            visible: true,
          });
          await settings.expectInfoBadgeVisible();
        });

        await test.step('Verify gas price options', async () => {
          await settings.clickItem(SETTINGS_MENU.GAS_PRICE.LABEL);
          await settings.expectItem(SETTINGS_MENU.GAS_PRICE.SLOW, {
            enabled: true,
          });
          await settings.expectItem(SETTINGS_MENU.GAS_PRICE.FAST, {
            enabled: true,
          });

          await settings.clickItem(SETTINGS_MENU.GAS_PRICE.SLOW);
          await settings.clickItem(SETTINGS_MENU.GAS_PRICE.LABEL);
          await settings.expectItem(SETTINGS_MENU.GAS_PRICE.SLOW, {
            visible: true,
          });
        });

        await test.step('Verify slippage settings', async () => {
          await settings.clickItem(SETTINGS_MENU.SLIPPAGE.LABEL);
          await settings.expectItem(SETTINGS_MENU.SLIPPAGE.AUTO, {
            visible: true,
          });

          const slippageValue = '0.05';
          await settings.fillSlippage(slippageValue);
          await settings.expectSlippageWarning(
            SETTINGS_MENU.SLIPPAGE.WARNING_MESSAGE,
          );
          await settings.clickItem(SETTINGS_MENU.SLIPPAGE.LABEL);
          await settings.expectSetting(`${slippageValue}%`, { visible: true });
          await settings.expectWarningBadgeVisible();
        });

        await test.step('Verify Bridge Settings - Deselect and select 1 bridge', async () => {
          await settings.clickItem(SETTINGS_MENU.BRIDGES.LABEL);
          const bridgeName = await settings.getFirstBridgeName();
          await settings.deselectFirstBridge();
          await settings.goBack();
          await settings.expectDeselectedAmount(SETTINGS_MENU.BRIDGES.LABEL, 1);

          await settings.clickItem(SETTINGS_MENU.BRIDGES.LABEL);
          await settings.selectBridgeByName(bridgeName);
          await settings.goBack();
          await settings.expectFractionsEqual(SETTINGS_MENU.BRIDGES.LABEL);
        });

        await test.step('Verify Exchange Settings - Deselect and select all exchanges', async () => {
          await settings.clickItem(SETTINGS_MENU.EXCHANGES.LABEL);
          await settings.deselectAll();
          await settings.goBack();
          await settings.expectNoneSelected(SETTINGS_MENU.EXCHANGES.LABEL);

          await settings.clickItem(SETTINGS_MENU.EXCHANGES.LABEL);
          await settings.selectAll();
          await settings.goBack();
          await settings.expectFractionsEqual(SETTINGS_MENU.EXCHANGES.LABEL);
        });

        await test.step('Reset settings', async () => {
          await settings.expectItem(SETTINGS_MENU.RESET.BUTTON, {
            visible: true,
          });
          await settings.clickReset(SETTINGS_MENU.RESET.BUTTON);
          await settings.confirmReset(
            SETTINGS_MENU.RESET.DIALOG_CONFIRM_BUTTON,
          );
          await settings.expectSetting(SETTINGS_MENU.RESET.BUTTON, {
            invisible: true,
          });

          await settings.expectSetting(
            SETTINGS_MENU.ROUTE_PRIORITY.BEST_RETURN,
            { visible: true },
          );
          await settings.expectSetting(SETTINGS_MENU.GAS_PRICE.NORMAL, {
            visible: true,
          });
          await settings.expectSetting(SETTINGS_MENU.SLIPPAGE.AUTO, {
            visible: true,
          });

          await settings.expectFractionsEqual(SETTINGS_MENU.BRIDGES.LABEL);
          await settings.expectFractionsEqual(SETTINGS_MENU.EXCHANGES.LABEL);
        });
      },
    );
  });
}
