import { qase } from 'playwright-qase-reporter';

import { THEME_DARK_BG_RGB, THEME_LIGHT_BG_RGB } from './data';
import { expect, noWalletTest as test } from './fixtures';
import { LandingPage, MainMenuPage, Theme } from './pages';

test.describe('Switch theme — dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(
    qase(30, 'Should able to change the theme color to Dark'),
    async ({ page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.closeWelcomeScreen();
      await mainMenu.open();
      await mainMenu.switchTheme(Theme.Dark);
      await mainMenu.expectBackgroundColor(THEME_DARK_BG_RGB);
    },
  );
});

test.describe('Switch theme — light mode', () => {
  test.use({ colorScheme: 'light' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(
    qase(31, 'Should able to change the theme color to Light'),
    async ({ page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.closeWelcomeScreen();
      await mainMenu.toggle();
      await landingPage.clickMenuItem('Theme');
      await landingPage.clickMenuItem(Theme.Light);
      await mainMenu.toggle();
      await mainMenu.expectBackgroundColor(THEME_LIGHT_BG_RGB);
    },
  );
});

test.describe('Switch theme — partner themes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(
    qase(
      49,
      'Partner theme should appear in theme menu and apply background color',
    ),
    async ({ page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.closeWelcomeScreen();

      const backgroundElement = page.locator('#background-root');
      const initialBgColor = await backgroundElement.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );

      await mainMenu.open();
      await landingPage.clickMenuItem('Theme');

      const partnerTheme = await mainMenu.findPartnerTheme();

      // Partner theme presence is Strapi-driven and absent on local/CI baseline; skip when not configured.
      /* eslint-disable playwright/no-conditional-in-test, playwright/no-skipped-test -- env-conditional skip */
      if (!partnerTheme) {
        test.skip();
        return;
      }
      /* eslint-enable playwright/no-conditional-in-test, playwright/no-skipped-test */

      await landingPage.clickMenuItem(partnerTheme);

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
