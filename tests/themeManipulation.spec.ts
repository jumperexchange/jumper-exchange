import { test } from '@playwright/test';
import {
  closeWelcomeScreen,
  itemInMenu,
} from './testData/landingPageFunctions';
import {
  openOrCloseMainMenu,
  Theme,
  switchTheme,
} from './testData/menuFunctions';
import { expectBackgroundColorToHaveCss } from './testData/menuFunctions';
import { qase } from 'playwright-qase-reporter';

test.describe('Switch between dark and light theme and check the background color', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.use({ colorScheme: 'dark' });
  test.skip(
    qase(30, 'Should able to change the theme color to Dark'),
    async ({ page }) => {
      await closeWelcomeScreen(page);
      await openOrCloseMainMenu(page);
      await switchTheme(page, Theme.Dark);
      await expectBackgroundColorToHaveCss(page, 'rgb(16, 0, 41)');
    },
  );

  test.use({ colorScheme: 'light' });
  test.skip(
    qase(31, 'Should able to change the theme color to Light'),
    async ({ page }) => {
      await closeWelcomeScreen(page);
      await page.locator('#main-burger-menu-button').click();
      await itemInMenu(page, 'Theme');
      await itemInMenu(page, Theme.Light);
      await page.locator('#main-burger-menu-button').click();
      expectBackgroundColorToHaveCss(page, 'rgb(246, 240, 255)');
    },
  );

  test(
    qase(49, 'Monad theme should appears when Monad chain is selected'),
    async ({ page }) => {
      await closeWelcomeScreen(page);
      await expectBackgroundColorToHaveCss(page, 'rgb(16, 0, 41)');
    },
  );
});
