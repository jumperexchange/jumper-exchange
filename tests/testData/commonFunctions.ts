import type { Page } from '@playwright/test';

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
}

export async function openMainMenu(page) {
  await page.locator('#main-burger-menu-button').click();
}

export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click({timeout:20000});
}
export async function closeWelcomeScreen(page: Page) {
  return page.locator('.widget-wrapper').first().click();
}
