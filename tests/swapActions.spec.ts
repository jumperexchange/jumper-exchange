import { test } from '@playwright/test';
import chainData from './testData/chainData.json' assert { type: 'json' };
import {
  buildUlParams,
  checkIfBestReturnLabelIsVisible,
  closeWelcomeScreen,
} from './testData/landingPageFunctions';

test.describe('On chain swaps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('ETH chain swap pairs', async ({ page }) => {
    await test.step(`Check ${chainData.ETHtoETHswap.ETHtoUSDT.tokenSymbol} to ${chainData.ETHtoETHswap.ETHtoUSDT.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ETHtoETHswap.ETHtoUSDT);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, true);
    });

    await test.step(`Check ${chainData.ETHtoETHswap.USDTtoDAI.tokenSymbol} to ${chainData.ETHtoETHswap.USDTtoDAI.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ETHtoETHswap.USDTtoDAI);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page,true);
    });

    await test.step(`Check ${chainData.ETHtoETHswap.USDCtoWETH.tokenSymbol} to ${chainData.ETHtoETHswap.USDCtoWETH.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ETHtoETHswap.USDCtoWETH);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page,true);
    });
  });

  test('ARB chain swap pairs', async ({ page }) => {
    await test.step(`Check ${chainData.ARBtoARB.ETHtoUSDT.tokenSymbol} to ${chainData.ARBtoARB.ETHtoUSDT.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ARBtoARB.ETHtoUSDT);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, true);
    });

    await test.step(`Check ${chainData.ARBtoARB.USDCtoWBTC.tokenSymbol} to ${chainData.ARBtoARB.USDCtoWBTC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.ARBtoARB.USDCtoWBTC);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, true);
    });
  });
  test('Hyperliquid chain swap pairs', async ({ page }) => {
    await test.step(`Check ${chainData.EVMtoHYPE.ETHtoUSDC.tokenSymbol} to ${chainData.EVMtoHYPE.ETHtoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.EVMtoHYPE.ETHtoUSDC);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, true);
    });
    await test.step(`Check ${chainData.BTCtoHYPE.BTCtoUSDC.tokenSymbol} to ${chainData.BTCtoHYPE.BTCtoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.BTCtoHYPE.BTCtoUSDC);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, false);
    });
    await test.step(`Check ${chainData.SOLtoHYPE.SOLtoUSDC.tokenSymbol} to ${chainData.SOLtoHYPE.SOLtoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.SOLtoHYPE.SOLtoUSDC);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, false);
    });
    await test.step(`Check ${chainData.SUItoHYPE.SUItoUSDC.tokenSymbol} to ${chainData.SUItoHYPE.SUItoUSDC.toTokenSymbol} swap pair`, async () => {
      const urlParams = buildUlParams(chainData.SUItoHYPE.SUItoUSDC);
      await page.goto(`/${urlParams}`);
      await checkIfBestReturnLabelIsVisible(page, false);
    });
    
    
  });
});
