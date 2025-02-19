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
  test(`Check ${chainData.ETHtoETHswap.ETHtoUSDT.tokenSymbol} to ${chainData.ETHtoETHswap.ETHtoUSDT.toTokenSymbol}USDT swap pair on ETH chain`, async ({
    page,
  }) => {
    const urlParams = buildUlParams(chainData.ETHtoETHswap.ETHtoUSDT);
    await page.goto(`/${urlParams}`);
    await checkIfBestReturnLabelIsVisible(page);
  });

  test(`Check ${chainData.ETHtoETHswap.USDTtoDAI.tokenSymbol} to ${chainData.ETHtoETHswap.USDTtoDAI.toTokenSymbol} swap pair on ETH chain`, async ({
    page,
  }) => {
    const urlParams = buildUlParams(chainData.ETHtoETHswap.USDTtoDAI);
    await page.goto(`/${urlParams}`);
    await checkIfBestReturnLabelIsVisible(page);
  });

  test(`Check ${chainData.ETHtoETHswap.USDCtoWETH.tokenSymbol} to ${chainData.ETHtoETHswap.USDCtoWETH.toTokenSymbol} swap pair on ETH chain`, async ({
    page,
  }) => {
    const urlParams = buildUlParams(chainData.ETHtoETHswap.USDCtoWETH);
    await page.goto(`/${urlParams}`);
    await checkIfBestReturnLabelIsVisible(page);
  });

  test(`Check ${chainData.ARBtoARB.ETHtoUSDT.tokenSymbol} to ${chainData.ARBtoARB.ETHtoUSDT.toTokenSymbol} swap pair on ARB chain`, async ({
    page,
  }) => {
    const urlParams = buildUlParams(chainData.ARBtoARB.ETHtoUSDT);
    await page.goto(`/${urlParams}`);
    await checkIfBestReturnLabelIsVisible(page);
  });
  test(`Check ${chainData.ARBtoARB.USDCtoWBTC.tokenSymbol} to ${chainData.ARBtoARB.USDCtoWBTC.toTokenSymbol} swap pair on ARB chain`, async ({
    page,
  }) => {
    const urlParams = buildUlParams(chainData.ARBtoARB.USDCtoWBTC);
    await page.goto(`/${urlParams}`);
    await checkIfBestReturnLabelIsVisible(page);
  });
});
