import { expect, test } from '@playwright/test';
import chainData from './testData/chainData.json' assert { type: 'json' };
import {
  buildUlParams,
  checkRoutesVisibility,
  closeWelcomeScreen,
} from './testData/landingPageFunctions';
import { clickItemInSettingsMenu } from './testData/settingsFunctions';

test.describe('On chain swaps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('ETH chain swap pair', async ({ page }) => {
    await test.step('Check if the Relay fallback route is shown', async () => {
      await page.getByRole('button', { name: 'Settings' }).click();
      await clickItemInSettingsMenu(page, 'Bridges');
      const deselectAllButton = page.getByTestId('CheckBoxOutlinedIcon'); // Deselect all bridges
      await deselectAllButton.click();
      await page.getByTestId('ArrowBackIcon').first().click();
      const urlParams = buildUlParams(chainData.ETHtoETHswap.ETHtoETH);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: true, checkRelayRoute: true });
    });
  });

  test('ARB chain swap pairs', async ({ page }) => {
    await test.step(`Check ${chainData.ARBtoARB.ETHtoUSDT.tokenSymbol} to ${chainData.ARBtoARB.ETHtoUSDT.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ARBtoARB.ETHtoUSDT);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: true });
    });

    await test.step(`Check ${chainData.ARBtoARB.USDCtoWBTC.tokenSymbol} to ${chainData.ARBtoARB.USDCtoWBTC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ARBtoARB.USDCtoWBTC);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: true });
    });
  });

  test('Hyperliquid chain swap pairs', async ({ page }) => {
    await test.step(`Check ${chainData.EVMtoHYPE.ETHtoUSDC.tokenSymbol} to ${chainData.EVMtoHYPE.ETHtoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.EVMtoHYPE.ETHtoUSDC);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: true });
    });

    await test.step(`Check ${chainData.BTCtoHYPE.BTCtoUSDC.tokenSymbol} to ${chainData.BTCtoHYPE.BTCtoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.BTCtoHYPE.BTCtoUSDC);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: false });
    });

    await test.step(`Check ${chainData.SOLtoHYPE.SOLtoUSDC.tokenSymbol} to ${chainData.SOLtoHYPE.SOLtoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.SOLtoHYPE.SOLtoUSDC);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: false });
    });

    await test.step(`Check ${chainData.SUItoHYPE.SUItoUSDC.tokenSymbol} to ${chainData.SUItoHYPE.SUItoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.SUItoHYPE.SUItoUSDC);
      await page.goto(`/${urlParams}`);
      await checkRoutesVisibility(page, { bestRetrunshouldBeVisible: false });
    });
  });
});
