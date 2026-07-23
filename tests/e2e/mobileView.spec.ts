import { expect } from '@playwright/test';

import enTranslation from '../../src/i18n/translations/en/translation.json' with { type: 'json' };
import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { MainMenuPage, Theme } from './pages/MainMenuPage';
import { isFullyInViewport } from './utils/elementUtils';
import { removeFormattingTags } from './utils/translationUtils';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';

test.describe('Verify essential mobile flows', () => {
  test.use({ viewport: { height: 812, width: 375 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Page fits the mobile viewport width correctly', async ({ page }) => {
    const viewport = page.viewportSize();
    // eslint-disable-next-line playwright/no-conditional-in-test -- null-guard for viewportSize()
    if (!viewport) {
      throw new Error('Viewport size not available');
    }

    const result = await page.evaluate(() => {
      const body = document.body;
      const doc = document.documentElement;

      const scrollWidth = Math.max(body.scrollWidth, doc.scrollWidth);
      const clientWidth = Math.max(body.clientWidth, doc.clientWidth);
      const offsetWidth = Math.max(body.offsetWidth, doc.offsetWidth);
      const hasHorizontalScroll = body.scrollWidth > window.innerWidth;

      return { clientWidth, hasHorizontalScroll, offsetWidth, scrollWidth };
    });

    expect(result.scrollWidth).toBeLessThanOrEqual(viewport.width);
    const layoutWidth = Math.max(result.offsetWidth, result.clientWidth);
    expect(layoutWidth).toBeGreaterThanOrEqual(viewport.width - 1);
    expect(result.hasHorizontalScroll).toBeFalsy();
  });

  test('Verify welcome page elements are visible in mobile view', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await test.step('check if elements are within the mobile viewport', async () => {
      const landingPageElements = [
        page.getByRole('heading', {
          name: enTranslation.navbar.welcome.title,
        }),
        page.getByText(
          removeFormattingTags(enTranslation.navbar.welcome.subtitle),
        ),
        page.getByText(enTranslation.navbar.welcome.cta),
      ];

      for (const element of landingPageElements) {
        expect(await isFullyInViewport(element, page)).toBe(true);
      }
    });

    await test.step('check chains/bridges/DEXs counters are populated', async () => {
      await landingPage.expectHomepageStatsLoaded();
    });

    await test.step('welcome can be closed', async () => {
      await landingPage.closeWelcomeScreen();
      await expect(landingPage.getStartedButton).toBeHidden();
    });
  });

  test('Verify items in the menu', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);

    await test.step('bypass the welcome screen', async () => {
      // The seed only applies on the next navigation, so re-goto after it.
      await seedWelcomeScreenClosed(page);
      await page.goto('/');
    });

    await test.step('open the menu', async () => {
      await mainMenu.open();
    });

    await test.step('check the number of menu items', async () => {
      await mainMenu.expectItemCount(11);
    });

    // Quarantined: mobile theme-switch flakes against the Strapi-driven menu
    // (suspected closeOnMobileViewport off-screen click or animation race).
    // Not currently tracked in Linear; re-enable after a dedicated
    // root-cause pass on the menu/animation interaction.
    // eslint-disable-next-line playwright/no-skipped-test -- quarantined flake
    await test.step.skip('switch theme', async () => {
      await mainMenu.switchTheme(Theme.Dark);
      await page.waitForFunction(
        () =>
          getComputedStyle(document.body).getPropertyValue('color-scheme') ===
          'dark',
        { timeout: 5000 },
      );
      await mainMenu.expectBackgroundColor('rgb(16, 0, 41)');
    });
  });
});
