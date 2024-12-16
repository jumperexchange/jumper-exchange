import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
}

export async function openOrCloseMainMenu(page) {
  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();
}

export async function checkTheNumberOfMenuItems(
  page,
  numberOfMenuItems: number,
) {
  await expect(page.getByRole('menuitem')).toHaveCount(numberOfMenuItems);
}

export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click();
}

export async function closeWelcomeScreen(page: Page) {
  return page.locator('#get-started-button').click();
}

export async function tabInHeader(page, tabname1: string, tabname2: string) {
  const gasTab = await page.locator('#tab-key-1');
  const exchangeTab = await page.locator('#tab-key-0');
  await gasTab.click();
  await expect(page.locator(`xpath=//p[text()="${tabname1}"]`)).toBeVisible();
  await exchangeTab.click();
  await expect(page.locator(`xpath=//p[text()=${tabname2}]`)).toBeVisible();
}

export async function expectBackgroundColorToHaveCss(page, rgb: string) {
  const backgroundColor = await page.locator('xpath=/html/body/div[1]');
  expect(backgroundColor).toHaveCSS(`background-color`, rgb);
}

export async function itemInSettingsMenu(page, selector: string) {
  await page
    .locator(`xpath=//p[normalize-space(text())="${selector}"]`)
    .click();
}

export async function itemInSettingsMenuToBeVisible(page, selector: string) {
  const itemName = await page.locator(
    `xpath=//button[normalize-space(text())="${selector}"]`,
  );
  expect(itemName).toBeVisible();
}
export async function itemInSettingsMenuToBeEnabled(page, selector: string) {
  const item = await page.locator(
    `xpath=//button[normalize-space(text())="${selector}"]`,
  );
  expect(item).toBeEnabled();
}

export async function sectionOnTheBlogPage(page, selectors: string[]) {
  for (const selector of selectors) {
    const sectionName = await page.locator(`#${selector}`);
    expect(sectionName).toBeVisible();
  }
}

export async function checkSocialNetworkIcons(page, networks: string[]) {
  for (const network of networks) {
    const socialNetworkIcon = await page.locator(
      `xpath=//button[@aria-label='Share article on ${network}']`,
    );
    await expect(socialNetworkIcon).toBeEnabled();
  }
}

export async function checkIfBestReturnLabelIsVisible(page) {
  const bestReturnLabel = page.locator(
    'xpath=//p[normalize-space(text())="Best Return"]',
  );
  await expect(bestReturnLabel).toBeVisible();
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
