import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import exp from 'constants';

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
}

export async function openOrCloseMainMenu(page) {
  await page.locator('#main-burger-menu-button').click();
}

export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click({ timeout: 20000 });
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

export async function expectMenuToBeVisible(page) {
  await expect(page.getByRole('menu')).toBeVisible();
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
