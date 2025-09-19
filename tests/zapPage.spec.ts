import { expect, test, type Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

import { checkTabsInHeader } from './testData/menuFunctions';
import { clickItemInSettingsMenu } from './testData/settingsFunctions';
import { SETTINGS_MENU } from './testData/testConstants';
import values from './testData/values.json' with { type: 'json' };

  async function verifyItemsCount(page: Page, locator: string , amount: number): Promise<void> {
     const listOfItems = page.getByTestId(locator);
     await expect(listOfItems).toBeVisible();
     const numberOfItems = listOfItems.locator('> div');
     const actualCount = await numberOfItems.count();
     expect(actualCount).toBeGreaterThanOrEqual(amount);
   }

test.describe('Zap Morpho Katana Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/missions/morpho-katana-gauntlet-usdc');
        await page.waitForLoadState('networkidle');
    });

    test(qase(33,'should verify the number of Bridges is higher than 20'), async ({ page }) => {
            await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
            await clickItemInSettingsMenu(page, SETTINGS_MENU.BRIDGES.LABEL);
            await verifyItemsCount(page, 'bridges-list', 1);
        });

    test(qase(34,'Should verify the number of Exchanges is higher than 20'), async ({ page }) => {
            await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
            await clickItemInSettingsMenu(page, SETTINGS_MENU.EXCHANGES.LABEL);
            await verifyItemsCount(page, 'exchanges-list', 20);
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