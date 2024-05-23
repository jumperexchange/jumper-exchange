import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

function closeWelcomeScreen(page: Page) {
  return page.locator('.widget-wrapper').first().click();
}

type Theme = 'light' | 'dark';
const themes: Theme[] = ['light', 'dark'];

themes.forEach((colorScheme) => {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test('should test welcome screen', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      expect(await page.screenshot()).toMatchSnapshot(
        ['landing', colorScheme, 'welcome_screen.png'],
        { maxDiffPixelRatio: 0.1 },
      );
    });

    test('should handle exchange page', async ({ page }) => {
      await page.goto('http://localhost:3000/exchange');
      await page.waitForLoadState('networkidle');
      await closeWelcomeScreen(page);

      await page.waitForTimeout(2000);

      expect(await page.screenshot()).toMatchSnapshot([
        'landing',
        colorScheme,
        'landing.png',
      ]);
    });

    test('should be able to open menu', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      await closeWelcomeScreen(page);

      await page.locator('#main-burger-menu-button').click();
      await expect(page.getByRole('menu')).toBeVisible();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);

      expect(await page.screenshot()).toMatchSnapshot([
        'landing',
        colorScheme,
        'menu.png',
      ]);
    });

    test('should be able to navigate to profile', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);

      expect(await page.screenshot()).toMatchSnapshot([
        'landing',
        colorScheme,
        'profile.png',
      ]);
    });

    test('should be able to navigate to jumper learn', async ({ page }) => {
      await page.goto('http://localhost:3000/learn');

      expect(await page.screenshot()).toMatchSnapshot([
        'landing',
        colorScheme,
        'learn.png',
      ]);
    });
  });
});
