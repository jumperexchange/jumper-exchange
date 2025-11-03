import { expect, test, type Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import { connectMetaMaskWallet } from './testData/connectWalletFunctions';
import { checkTabsInHeader } from './testData/menuFunctions';
import { clickItemInSettingsMenu } from './testData/settingsFunctions';
import { SETTINGS_MENU } from './testData/testConstants';
import values from './testData/values.json' with { type: 'json' };
import basicSetup from './wallet-setup/basic.setup';


  async function verifyItemsCount(page: Page, locator: string , amount: number): Promise<void> {
     const listOfItems = page.getByTestId(locator);
     await expect(listOfItems).toBeVisible();
     const numberOfItems = listOfItems.locator('> div');
     const actualCount = await numberOfItems.count();
     expect(actualCount).toBeGreaterThanOrEqual(amount);
   }

test.describe('Zap Morpho Katana Page', () => {
  const test = testWithSynpress(metaMaskFixtures(basicSetup));
  const { expect } = test;
    
    test('Should connect EVM Metamask wallet', async ({ context, page, extensionId }) => {
        await test.step('Connect Metamask wallet to ZAP', async () => {
          await connectMetaMaskWallet(context, page, extensionId);
        });

        await test.step('Navigate to Morpho Katana page', async () => {
            await page.goto('/missions/morpho-katana-gauntlet-usdc');
            await page.waitForLoadState('networkidle');
        });

        await test.step(qase(33,'should verify the number of Bridges is higher than 1'), async () => {
            await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
            await clickItemInSettingsMenu(page, SETTINGS_MENU.BRIDGES.LABEL);
            await verifyItemsCount(page, 'bridges-list', 1);
        });

        // await test.step(qase(34,'Should verify the number of Exchanges is higher than 20'), async () => {
        //     const backIcon = page.locator('xpath=(//span[@class="MuiTouchRipple-root mui-4mb1j7"])[2]');
        //     await backIcon.click();
        //     await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
        //     await clickItemInSettingsMenu(page, SETTINGS_MENU.EXCHANGES.LABEL);
        //     await verifyItemsCount(page, 'exchanges-list', 20);
        // });

        await test.step(qase(32,'Verify the url of Discover Morpho link'), async () => {
            const discoverMorphoLink = page.getByRole('link', { name: 'Discover Morpho' });
            await expect(discoverMorphoLink).toHaveAttribute('href', values.morphoURL);
        });
        
        await test.step('Verify that Missions and Exchange tabs are visible in the header of the page', async () => {
          await checkTabsInHeader(page);
        });
    });
  })