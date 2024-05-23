import type { Page } from '@playwright/test';

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
  await page.locator('.widget-wrapper').first().click();
}

export async function openMainMenu(page) {
  await page.locator('#main-burger-menu-button').click();
}

export async function itemInMenu(page , option:string) {
    await page.getByRole('menuitem', { name: option }).click();

}
export async function closeWelcomeScreen(page: Page) {
    return page.locator('.widget-wrapper').first().click();
  }