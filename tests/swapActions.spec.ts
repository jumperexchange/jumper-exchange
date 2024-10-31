import { test, expect } from '@playwright/test';
import chainData from './testData/chainData.json';
import { closeWelcomeScreen } from './testData/commonFunctions';

test('Exchange URL parameters for multiple token pairs', async ({ page }) => {
  for (const fromChainKey in chainData) {
    const fromChainData = chainData[fromChainKey];

    for (const swapPairKey in fromChainData) {
      const swapPairData = fromChainData[swapPairKey];
      const fromTokenData = {
        tokenSymbol: swapPairData.tokenSymbol,
        fromToken: swapPairData.fromToken,
        fromChain: swapPairData.fromChain,
        amount: swapPairData.amount,
      };
      const toTokenData = {
        toTokenSymbol: swapPairData.toTokenSymbol,
        toToken: swapPairData.toToken,
        toChain: swapPairData.toChain,
      };
      const url = `http://localhost:3000/?fromAmount=${fromTokenData.amount}&fromChain=${fromTokenData.fromChain}&fromToken=${fromTokenData.fromToken}&toChain=${toTokenData.toChain}&toToken=${toTokenData.toToken}`;
      await page.goto(url);
      await expect(page).toHaveURL(url);
      await closeWelcomeScreen(page);
      const bestReturnLabel = page.locator(
        'xpath=//p[normalize-space(text())="Best Return"]',
      );
        await expect(bestReturnLabel).toBeVisible();
      }
    }
})