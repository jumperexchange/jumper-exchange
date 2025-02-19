import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
}

export async function closeWelcomeScreen(page: Page) {
  return page.locator('#get-started-button').click();
}
export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click();
}

export async function tabInHeader(page, tabname1: string, tabname2: string) {
  const gasTab = await page.locator('#tab-key-1');
  const exchangeTab = await page.locator('#tab-key-0');
  await gasTab.click();
  await expect(page.locator(`xpath=//p[text()="${tabname1}"]`)).toBeVisible();
  await exchangeTab.click();
  await expect(page.locator(`xpath=//p[text()=${tabname2}]`)).toBeVisible();
}

export async function checkIfBestReturnLabelIsVisible(page) {
  const bestReturnLabel = page.locator(
    'xpath=//p[normalize-space(text())="Best Return"]',
  );
  await expect(bestReturnLabel).toBeVisible();
}
export async function navigateToTab(page, tabKey, expectedText) {
  await page.locator(`#tab-key-${tabKey}`).click();
  await expect(page.locator(`xpath=//p[text()="${expectedText}"]`)).toBeVisible();
}

export function buildUlParams(data: {
  amount: string;
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
}): string {
  const params = new URLSearchParams({
    fromAmount: data.amount,
    fromChain: data.fromChain,
    fromToken: data.fromToken,
    toChain: data.toChain,
    toToken: data.toToken,
  });
  return `?${params.toString()}`;
}
