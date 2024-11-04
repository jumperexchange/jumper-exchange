import { test } from '@playwright/test';
import chainData from './testData/chainData.json';
import {
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
    await page.goto(
      `?fromAmount=${chainData.ETHtoETHswap.ETHtoUSDT.amount}&fromChain=${chainData.ETHtoETHswap.ETHtoUSDT.fromChain}&fromToken=${chainData.ETHtoETHswap.ETHtoUSDT.fromToken}&toChain=${chainData.ETHtoETHswap.ETHtoUSDT.toChain}&toToken=${chainData.ETHtoETHswap.ETHtoUSDT.toToken}`,
    );
    await checkIfBestReturnLabelIsVisible(page);
  });

  test(`Check ${chainData.ETHtoETHswap.USDTtoDAI.tokenSymbol} to ${chainData.ETHtoETHswap.USDTtoDAI.toTokenSymbol} swap pair on ETH chain`, async ({
    page,
  }) => {
    await page.goto(
      `?fromAmount=${chainData.ETHtoETHswap.USDTtoDAI.amount}&fromChain=${chainData.ETHtoETHswap.USDTtoDAI.fromChain}&fromToken=${chainData.ETHtoETHswap.USDTtoDAI.fromToken}&toChain=${chainData.ETHtoETHswap.USDTtoDAI.toChain}&toToken=${chainData.ETHtoETHswap.USDTtoDAI.toToken}`,
    );
    await checkIfBestReturnLabelIsVisible(page);
  });

  test(`Check ${chainData.ETHtoETHswap.USDCtoWETH.tokenSymbol} to ${chainData.ETHtoETHswap.USDCtoWETH.toTokenSymbol} swap pair on ETH chain`, async ({
    page,
  }) => {
    await page.goto(
      `?fromAmount=${chainData.ETHtoETHswap.USDCtoWETH.amount}&fromChain=${chainData.ETHtoETHswap.USDCtoWETH.fromChain}&fromToken=${chainData.ETHtoETHswap.USDCtoWETH.fromToken}&toChain=${chainData.ETHtoETHswap.USDCtoWETH.toChain}&toToken=${chainData.ETHtoETHswap.USDCtoWETH.toToken}`,
    );
    await checkIfBestReturnLabelIsVisible(page);
  });
});
