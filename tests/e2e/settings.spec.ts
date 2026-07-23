import { SETTINGS_MENU } from './data/settingsMenu';
import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { SettingsPage } from './pages/SettingsPage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';
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
      await seedWelcomeScreenClosed(page);
      await landingPage.goto();
    });
    // jscpd:ignore-end

    test('Should verify all settings menu functionality', async ({ page }) => {
      // The Desktop variant stalls under CI load — the freeze roves between
      // heavy steps (120s click/render timeouts); Mobile and local Desktop
      // runs are unaffected.
      test.fixme(
        name === 'Desktop',
        'JUM-1116: settings Desktop CI shard stall (step-roving click freeze)',
      );
      const settings = new SettingsPage(page);

      await test.step('Open settings menu', async () => {
        await settings.open(SETTINGS_MENU.TITLE);
      });

      await test.step('Verify route priority options', async () => {
        await settings.clickItem(SETTINGS_MENU.ROUTE_PRIORITY.LABEL);
        await settings.expectListOptionSelected(
          SETTINGS_MENU.ROUTE_PRIORITY.BEST_RETURN.OPTION_ID,
        );
        await settings.expectListOptionVisible(
          SETTINGS_MENU.ROUTE_PRIORITY.FASTEST.OPTION_ID,
        );

        await settings.clickListOption(
          SETTINGS_MENU.ROUTE_PRIORITY.FASTEST.OPTION_ID,
        );
        await settings.expectListOptionSelected(
          SETTINGS_MENU.ROUTE_PRIORITY.FASTEST.OPTION_ID,
        );
        // Selecting does not navigate back.
        await settings.goBack();
        await settings.expectCardValue(
          SETTINGS_MENU.ROUTE_PRIORITY.CARD,
          SETTINGS_MENU.ROUTE_PRIORITY.FASTEST.LABEL,
        );
        await settings.expectCardBadge(
          SETTINGS_MENU.ROUTE_PRIORITY.CARD,
          'info',
        );
      });

      await test.step('Verify gas price options', async () => {
        await settings.clickItem(SETTINGS_MENU.GAS_PRICE.LABEL);
        await settings.expectGasOptionEnabled(SETTINGS_MENU.GAS_PRICE.SLOW);
        await settings.expectGasOptionEnabled(SETTINGS_MENU.GAS_PRICE.FAST);

        await settings.clickGasOption(SETTINGS_MENU.GAS_PRICE.SLOW);
        await settings.clickItem(SETTINGS_MENU.GAS_PRICE.LABEL);
        await settings.expectCardValue(
          SETTINGS_MENU.GAS_PRICE.CARD,
          SETTINGS_MENU.GAS_PRICE.SLOW,
        );
      });

      await test.step('Verify slippage settings', async () => {
        await settings.clickItem(SETTINGS_MENU.SLIPPAGE.LABEL);
        await settings.expectListOptionSelected(
          SETTINGS_MENU.SLIPPAGE.AUTO.OPTION_ID,
        );
        for (const presetId of SETTINGS_MENU.SLIPPAGE.PRESET_OPTION_IDS) {
          await settings.expectListOptionVisible(presetId);
        }

        // The custom input only renders after selecting the Custom row.
        await settings.clickListOption(SETTINGS_MENU.SLIPPAGE.CUSTOM.OPTION_ID);
        const slippageValue = '0.05';
        await settings.fillSlippage(slippageValue);
        await settings.expectSlippageWarning(
          SETTINGS_MENU.SLIPPAGE.WARNING_MESSAGE,
        );
        await settings.goBack();
        await settings.expectCardValue(
          SETTINGS_MENU.SLIPPAGE.CARD,
          `${slippageValue}%`,
        );
        await settings.expectCardBadge(SETTINGS_MENU.SLIPPAGE.CARD, 'warning');
      });

      await test.step('Verify Bridge Settings - Deselect and select 1 bridge', async () => {
        await settings.clickItem(SETTINGS_MENU.BRIDGES.LABEL);
        const bridgeName = await settings.getFirstBridgeName();
        await settings.deselectFirstBridge();
        await settings.goBack();
        await settings.expectDeselectedAmount(SETTINGS_MENU.BRIDGES.CARD, 1);

        await settings.clickItem(SETTINGS_MENU.BRIDGES.LABEL);
        await settings.selectBridgeByName(bridgeName);
        await settings.goBack();
        await settings.expectFractionsEqual(SETTINGS_MENU.BRIDGES.CARD);
      });

      await test.step('Verify Exchange Settings - Deselect and select all exchanges', async () => {
        await settings.clickItem(SETTINGS_MENU.EXCHANGES.LABEL);
        await settings.deselectAll();
        await settings.goBack();
        await settings.expectNoneSelected(SETTINGS_MENU.EXCHANGES.CARD);

        await settings.clickItem(SETTINGS_MENU.EXCHANGES.LABEL);
        await settings.selectAll();
        await settings.goBack();
        await settings.expectFractionsEqual(SETTINGS_MENU.EXCHANGES.CARD);
      });

      await test.step('Reset settings', async () => {
        await settings.expectResetButtonVisible(SETTINGS_MENU.RESET.BUTTON);
        await settings.clickReset(SETTINGS_MENU.RESET.BUTTON);
        await settings.confirmReset(SETTINGS_MENU.RESET.DIALOG_CONFIRM_BUTTON);
        await settings.expectResetButtonHidden(SETTINGS_MENU.RESET.BUTTON);

        await settings.expectCardValue(
          SETTINGS_MENU.ROUTE_PRIORITY.CARD,
          SETTINGS_MENU.ROUTE_PRIORITY.BEST_RETURN.LABEL,
        );
        await settings.expectCardValue(
          SETTINGS_MENU.GAS_PRICE.CARD,
          SETTINGS_MENU.GAS_PRICE.NORMAL,
        );
        await settings.expectCardValue(
          SETTINGS_MENU.SLIPPAGE.CARD,
          SETTINGS_MENU.SLIPPAGE.AUTO.LABEL,
        );

        await settings.expectFractionsEqual(SETTINGS_MENU.BRIDGES.CARD);
        await settings.expectFractionsEqual(SETTINGS_MENU.EXCHANGES.CARD);
      });
    });
  });
}
