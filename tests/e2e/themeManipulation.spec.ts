import { expect } from '@playwright/test';

import { THEME_DARK_BG_RGB, THEME_LIGHT_BG_RGB } from './data/themes';
import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { MainMenuPage, Theme } from './pages/MainMenuPage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';

test.describe('Switch theme — dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test.beforeEach(async ({ page }) => {
    await seedWelcomeScreenClosed(page);
    await page.goto('/');
  });

  test('Should able to change the theme color to Dark', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.open();
    await mainMenu.switchTheme(Theme.Dark);
    await mainMenu.expectBackgroundColor(THEME_DARK_BG_RGB);
  });
});

test.describe('Switch theme — light mode', () => {
  test.use({ colorScheme: 'light' });

  test.beforeEach(async ({ page }) => {
    await seedWelcomeScreenClosed(page);
    await page.goto('/');
  });

  test('Should able to change the theme color to Light', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const mainMenu = new MainMenuPage(page);
    await mainMenu.toggle();
    await landingPage.clickMenuItem('Theme');
    await landingPage.clickMenuItem(Theme.Light);
    await mainMenu.toggle();
    await mainMenu.expectBackgroundColor(THEME_LIGHT_BG_RGB);
  });
});

test.describe('Switch theme — partner themes', () => {
  test.beforeEach(async ({ page }) => {
    await seedWelcomeScreenClosed(page);
    await page.goto('/');
  });

  test('Partner theme should appear in theme menu and apply background color', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);
    const mainMenu = new MainMenuPage(page);

    const backgroundElement = page.locator('#background-root');
    const initialBgColor = await backgroundElement.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    await mainMenu.open();
    await landingPage.clickMenuItem('Theme');

    const partnerTheme = await mainMenu.findPartnerTheme();

    /* eslint-disable playwright/no-conditional-in-test, playwright/no-skipped-test -- env-conditional skip */
    if (!partnerTheme) {
      test.skip(
        true,
        'Partner theme not configured in this environment (Strapi-driven)',
      );
      return;
    }
    /* eslint-enable playwright/no-conditional-in-test, playwright/no-skipped-test */

    await landingPage.clickMenuItem(partnerTheme);

    // Poll until the theme transition has applied; one-shot evaluate races
    // the style update.
    await expect
      .poll(() =>
        backgroundElement.evaluate((el, prevBgColor) => {
          const bgColorChanged =
            getComputedStyle(el).backgroundColor !== prevBgColor;
          // Partner themes render the bg as a <canvas>/<video>
          // (CanvasBackground/AnimatedBackgroundImage), not just color/<img>.
          const imgElement = el.querySelector('img');
          const hasBackground =
            (imgElement !== null && !!imgElement.src) ||
            el.querySelector('video') !== null ||
            el.querySelector('canvas') !== null;
          return bgColorChanged || hasBackground;
        }, initialBgColor),
      )
      .toBe(true);
  });
});
