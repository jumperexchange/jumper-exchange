import { execSync } from 'child_process';
import { testWithSynpress } from '@synthetixio/synpress-core';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress';
import { openOrCloseMainMenu, itemInMenu, closeWelcomeScreen } from './testData/commonFunctions';
import basicSetup from './wallet-setup/basic.setup';

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.beforeAll(async () => {
  console.log('Starting local environment...');
  execSync('yarn dev &', { stdio: 'inherit' }); 
  console.log('Waiting for localhost:3000...');
  execSync('npx wait-on http://localhost:3000 --timeout 300000 --interval 2000 --log-level error', {
    stdio: 'inherit',
  }); 
  console.log('Building cache...');
  execSync('yarn build:cache:ci --force tests/wallet-setup/', { stdio: 'inherit' });
});

test.describe('Connect Metamask with Jumper app and open /profile page', () => {
  test('should connect wallet to Jumper', async ({
    context,
    page,
    extensionId,
  }) => {
    const metamask = new MetaMask(
      context,
      page,
      basicSetup.walletPassword,
      extensionId,
    );
    const connectWalletButton = page.locator('#connect-wallet-button');
    const metaMaskWalletOption = page.locator('xpath=//span[normalize-space(text())="MetaMask"]');
    const availableMissionTitle = page.locator('xpath=//p[normalize-space(text())="Available Missions"]');
    await page.goto('/');
    await expect(connectWalletButton).toBeEnabled();
    await connectWalletButton.click();
    await metaMaskWalletOption.click();
    await metamask.connectToDapp(['Account 1']);
    await closeWelcomeScreen(page);
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Jumper Profile');
    await page.locator('.profile-page').isVisible();
    await expect(availableMissionTitle).toBeVisible();
  });
});
