import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const getRankValue = async (page: Page) => {
  const rankSelector = 'xpath=(//div[@class="MuiBox-root mui-19kp780"]//p)[1]';
  return await page.locator(rankSelector).textContent();
};

export const verifyRankValueVisibility = async (page, rankValue) => {
  const rankElements = page.locator(`text=${rankValue}`);
  await expect(rankElements).toHaveCount(2);
  for (const element of await rankElements.all()) {
    await expect(element).toBeVisible();
  }
};

export const verifyPageParameter = async (page) => {
  const currentUrl = page.url();
  await expect(currentUrl).toContain('page=');
  await expect(currentUrl.split('page=')[1]).not.toBe('undefined');
};

export const connectedWalletButton = async (page: Page) => {
  await page.locator('#wallet-digest-button').click();
};

export const connectButton = (page: Page) => {
  return page.locator('#connect-wallet-button');
};

export const connectAnotherWalletButton = (page: Page) => {
  return page.locator('#connect-another-wallet-button');
};

export const disconnectWalletButton = (page: Page) => {
  return page.locator('#disconnect-wallet-button');
};
  