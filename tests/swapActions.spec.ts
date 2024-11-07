import { test } from '@playwright/test';
import chainData from './testData/chainData.json';
import {
  buildUlParams,
  checkIfBestReturnLabelIsVisible,
  closeWelcomeScreen,
} from './testData/commonFunctions';

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
});
