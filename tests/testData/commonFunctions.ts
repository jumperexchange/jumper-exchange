import { expect , Page } from '@playwright/test';

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
}

export async function openMainMenu(page) {
  await page.locator('#main-burger-menu-button').click();
}

export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click({ timeout: 20000 });
}
export async function closeWelcomeScreen(page: Page) {
  return page.locator('#get-started-button').click();
}

export async function tabInHeader(page, name: string) {
  await page.locator(`xpath=(//button[@id="${name}"])[1]`).click();
}

export async function expectMenuToBeVisible(page){
  await expect(page.getByRole('menu')).toBeVisible();
}
export async function expectBackgroundColorToHaveCss(page, rgb: string){
  const backgroundColor = await page.locator('xpath=/html/body/div[1]');
  expect(backgroundColor).toHaveCSS(`background-color`, rgb);
}