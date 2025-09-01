import { expect, test, type Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { clickItemInSettingsMenu } from './testData/settingsFunctions';
import { SETTINGS_MENU } from './testData/testConstants';
import values from './testData/values.json' assert { type: 'json' };
import { checkTabsInHeader } from './testData/menuFunctions';

async function verifyBridgesCount(
  page: Page,
  numberOfBridges: number,
): Promise<void> {
  const widgetContainer = page.getByTestId('zap-widget-container');
  const listOfBridges = widgetContainer.locator(
    'ul.MuiList-root.MuiList-padding div[role="button"]',
  );
  await expect(listOfBridges).toHaveCount(numberOfBridges);
}

test.describe('Zap Morpho Katana Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/missions/morpho-katana-gauntlet-usdc');
    await page.waitForLoadState('networkidle');
  });

  // @Note: Disabled for the moment until we know for sure how many bridges we need to support
  // test(qase(121,'Should verify bridge selection list has exactly 2 bridges'), async ({ page }) => {
  //     await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
  //     await clickItemInSettingsMenu(page, SETTINGS_MENU.BRIDGES.LABEL);
  //     await verifyBridgesCount(page, 2);
  // });

  test(
    qase(120, 'Verify the url of Discover Morpho link'),
    async ({ page }) => {
      await test.step('Verify the url of Discover Morpho link', async () => {
        const discoverMorphoLink = page.getByRole('link', {
          name: 'Discover Morpho',
        });
        await expect(discoverMorphoLink).toHaveAttribute(
          'href',
          values.morphoURL,
        );
      });

      await test.step('Verify that Missions and Exchange tabs are visible in the header of the page', async () => {
        await checkTabsInHeader(page);
      });
    },
  );
});
