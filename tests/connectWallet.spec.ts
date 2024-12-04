import { testWithSynpress } from '@synthetixio/synpress-core';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress';
import { openOrCloseMainMenu , itemInMenu, closeWelcomeScreen } from './testData/commonFunctions';
import connectedSetup from './wallet-setup/connected.setup';
import  buildSynpressCache  from '../synpressCache';

const test = testWithSynpress(metaMaskFixtures(connectedSetup));

const { expect } = test;
test.describe('Connect Metamask with Jumper app and open /profile page',()=>{
  test.beforeAll(() => {
    buildSynpressCache()
  })
  test('should connect wallet to Jumper', async ({
    context,
    page,
    extensionId,
  }) => {
    const metamask = new MetaMask(
      context,
      page,
      connectedSetup.walletPassword,
      extensionId,
    );
    const connectWalletButton = page.locator('#connect-wallet-button');
    const metaMaskWalletOption = page.locator('xpath=//span[normalize-space(text())="MetaMask"]');
    const availableMissionTitle = page.locator('xpath=//p[normalize-space(text())="Available Missions"]');
    await expect(connectWalletButton).toBeEnabled();
    await connectWalletButton.click();
    await metaMaskWalletOption.click();
    await metamask.connectToDapp(['Account 1']);
    await closeWelcomeScreen(page)
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Jumper Profile');
    await page.locator('.profile-page').isVisible();
    await expect(availableMissionTitle).toBeVisible();
  });
})
