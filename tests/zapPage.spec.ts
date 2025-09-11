import { expect, test, type Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

import { checkTabsInHeader } from './testData/menuFunctions';
import { clickItemInSettingsMenu } from './testData/settingsFunctions';
import { SETTINGS_MENU } from './testData/testConstants';
import values from './testData/values.json' with { type: 'json' };

 async function verifyItemsCount(page: Page, locator: string, expectedCount: number): Promise<void> {
    const widgetContainer = page.getByTestId('zap-widget-container');
    const listOfItems = widgetContainer.locator(locator);
    await expect(listOfItems).toHaveCount(expectedCount);
  }

test.describe('Zap Morpho Katana Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/missions/morpho-katana-gauntlet-usdc');
        await page.waitForLoadState('networkidle');
    });

    test(qase(33,'Verify bridge selection list has exactly 23 bridges'), async ({ page }) => {
            await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
            await clickItemInSettingsMenu(page, SETTINGS_MENU.BRIDGES.LABEL);
            await verifyItemsCount(page, '[data-testid="bridges-list"] > div', 23);
        });

    test(qase(34,'Should verify the number of Exchanges is exactly 24'), async ({ page }) => {
            await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
            await clickItemInSettingsMenu(page, SETTINGS_MENU.EXCHANGES.LABEL);
            await verifyItemsCount(page, '[data-testid="exchanges-list"] > div', 24);
        });

    test(qase(32,'Verify the url of Discover Morpho link'), async ({ page }) => {
      await test.step('Verify the url of Discover Morpho link', async () => {
        const discoverMorphoLink = page.getByRole('link', { name: 'Discover Morpho' });
        await expect(discoverMorphoLink).toHaveAttribute('href', values.morphoURL);
      });
      
      await test.step('Verify that Missions and Exchange tabs are visible in the header of the page', async () => {
        await checkTabsInHeader(page);
      });
    });
  })