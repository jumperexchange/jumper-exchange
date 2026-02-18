import { expect, test } from '@playwright/test';
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
  test(
    qase(30, 'Should able to change the theme color to Dark'),
    async ({ page }) => {
      await closeWelcomeScreen(page);
      await openOrCloseMainMenu(page);
      await switchTheme(page, Theme.Dark);
      await expectBackgroundColorToHaveCss(page, 'rgb(18, 11, 30)');
    },
  );

  test.use({ colorScheme: 'light' });
  test(
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
    qase(
      49,
      'Partner theme should appear in theme menu and apply background color',
    ),
    async ({ page }) => {
      await closeWelcomeScreen(page);

      // Get initial background color
      const backgroundElement = page.locator('#background-root');
      const initialBgColor = await backgroundElement.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );

      // Open menu and navigate to Theme submenu
      await openOrCloseMainMenu(page);
      await itemInMenu(page, 'Theme');

      // Find partner theme (any menu item that's not Light or Dark)
      const menuItems = page.getByRole('menuitem');
      const allMenuItems = await menuItems.allTextContents();
      const partnerTheme = allMenuItems.find(
        (item) =>
          !['Light', 'Dark', 'System'].includes(item) && item.trim() !== '',
      );

      // Skip if no partner theme is available
      if (!partnerTheme) {
        test.skip();
        return;
      }

      // Select the partner theme
      await itemInMenu(page, partnerTheme);

      // Verify background color changed or background image appeared
      const isThemeApplied = await backgroundElement.evaluate(
        (el, prevBgColor) => {
          const bgColorChanged =
            getComputedStyle(el).backgroundColor !== prevBgColor;
          const imgElement = el.querySelector('img');
          const hasBgImage = imgElement !== null && !!imgElement.src;
          return bgColorChanged || hasBgImage;
        },
        initialBgColor,
      );

      expect(isThemeApplied).toBe(true);
    },
  );
});
