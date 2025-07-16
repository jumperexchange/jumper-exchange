import { expect } from '@playwright/test';
import { itemInMenu } from './landingPageFunctions';

export const MAIN_MENU = {
  BURGER_MENU_BUTTON: '#main-burger-menu-button',
  MENU: 'xpath=//*[@role="menu"]',
};

export async function openOrCloseMainMenu(page) {
  await page.locator(MAIN_MENU.BURGER_MENU_BUTTON).click();
  await expect(page.locator(MAIN_MENU.MENU)).toBeVisible();
}

export async function openLeaderboardPage(page) {
  await page.locator('#leaderboard-button').click();
}

export async function checkTheNumberOfMenuItems(
  page,
  numberOfMenuItems: number,
) {
  await expect(page.getByRole('menuitem')).toHaveCount(numberOfMenuItems);
}

export async function checkSocialNetworkIcons(page, networks: string[]) {
  for (const network of networks) {
    const socialNetworkIcon = await page.locator(
      `xpath=//button[@aria-label='Share article on ${network}']`,
    );
    await expect(socialNetworkIcon).toBeEnabled();
  }
}

export async function sectionOnTheBlogPage(page, selectors: string[]) {
  for (const selector of selectors) {
    const sectionName = await page.locator(`#${selector}`);
    expect(sectionName).toBeVisible();
  }
}

export async function expectBackgroundColorToHaveCss(page, rgb: string) {
  const backgroundColor = await page.locator('#background-root');
  expect(backgroundColor).toHaveCSS('background-color', rgb);
}

export enum Theme {
  Light = 'Light',
  Dark = 'Dark',
}
export async function switchTheme(page, theme: Theme) {
  await itemInMenu(page, 'Theme');
  await itemInMenu(page, theme);
  // Click the menu button using its coordinates
  const menuButton = await page.locator(MAIN_MENU.BURGER_MENU_BUTTON);
  const box = await menuButton.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
}
