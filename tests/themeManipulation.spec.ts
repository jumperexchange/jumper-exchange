import { test } from '@playwright/test';
import { closeWelcomeScreen } from './testData/landingPageFunctions';

import { expectBackgroundColorToHaveCss } from './testData/menuFunctions';

test.describe('Switch between dark and light theme and check the background color', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.use({ colorScheme: 'dark' });
  test('Should able to change the theme color to Dark', async ({ page }) => {
    await closeWelcomeScreen(page);
    await page.locator('#main-burger-menu-button').click();
    await page.locator('#theme-switch-tabs-1').click();
    await page.locator('#main-burger-menu-button').click();
    await expectBackgroundColorToHaveCss(page, 'rgb(18, 15, 41)');
  });

  test.use({ colorScheme: 'light' });
  test('Should able to change the theme color to Light', async ({ page }) => {
    await closeWelcomeScreen(page);
    await page.locator('#main-burger-menu-button').click();
    await page.locator('#theme-switch-tabs-0').click();
    await page.locator('#main-burger-menu-button').click();
    expectBackgroundColorToHaveCss(page, 'rgb(243, 235, 255)');
  });
});
