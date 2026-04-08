import { test, expect } from '@playwright/test';
import enTranslation from '../src/i18n/translations/en/translation.json' with { type: 'json' };
import { removeFormattingTags } from '../tests/utils/translationUtils';
import { closeWelcomeScreen } from './testData/landingPageFunctions';
import { isFullyInViewport } from './utils/elementUtils';
import {
  checkTheNumberOfMenuItems,
  expectBackgroundColorToHaveCss,
  openOrCloseMainMenu,
  switchTheme,
  Theme,
} from './testData/menuFunctions';
import { qase } from 'playwright-qase-reporter';

test.describe('Verify essential mobile flows', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test(
    qase(4, 'Page fits the mobile viewport width correctly'),
    async ({ page }) => {
      const viewport = page.viewportSize();
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

        return {
          scrollWidth,
          clientWidth,
          offsetWidth,
          hasHorizontalScroll,
        };
      });

      // Ensure no horizontal overflow
      expect(result.scrollWidth).toBeLessThanOrEqual(viewport.width);

      // Ensure layout isn't too narrow (allow 1px tolerance)
      const layoutWidth = Math.max(result.offsetWidth, result.clientWidth);
      expect(layoutWidth).toBeGreaterThanOrEqual(viewport.width - 1);

      // Ensure no horizontal scrollbars
      expect(result.hasHorizontalScroll).toBeFalsy();
    },
  );

  test(
    qase(5, 'Verify welcome page elements are visible in mobile view'),
    async ({ page }) => {
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

      await test.step('check if the number of chains, bridges and DEXs are loaded', async () => {
        await page.waitForLoadState('networkidle'); // Making sure the number of chains, bridges and DEXs are loaded

        const chainsLocator = page.locator(
          '//*[text()="Chains"]/preceding-sibling::*[1]',
        );
        const bridgesLocator = page.locator(
          '//*[text()="Bridges"]/preceding-sibling::*[1]',
        );
        const dexsLocator = page.locator(
          '//*[text()="DEXs"]/preceding-sibling::*[1]',
        );

        // Wait until all three have a non-zero numeric value
        await expect(chainsLocator).not.toHaveText('0', { timeout: 5000 });
        await expect(bridgesLocator).not.toHaveText('0', { timeout: 5000 });
        await expect(dexsLocator).not.toHaveText('0', { timeout: 5000 });

        const numberOfChains = (await chainsLocator.textContent()) as string;
        const numberOfBridges = (await bridgesLocator.textContent()) as string;
        const numberOfDEXs = (await dexsLocator.textContent()) as string;

        expect(Number(numberOfChains)).toBeGreaterThan(0);
        expect(Number(numberOfBridges)).toBeGreaterThan(0);
        expect(Number(numberOfDEXs)).toBeGreaterThan(0);
      });

      await test.step('welcome can be closed', async () => {
        await closeWelcomeScreen(page);
        await expect(page.getByTestId('get-started-button')).not.toBeVisible();
      });
    },
  );

  test(qase(6, 'Verify items in the menu'), async ({ page }) => {
    await test.step('close the welcome screen', async () => {
      await closeWelcomeScreen(page);
    });

    await test.step('open the menu', async () => {
      await openOrCloseMainMenu(page);
    });

    await test.step('check the number of menu items', async () => {
      await checkTheNumberOfMenuItems(page, 10);
    });

    await test.step.skip('switch theme', async () => {
      await switchTheme(page, Theme.Dark);
      await page.waitForFunction(
        () => {
          return (
            getComputedStyle(document.body).getPropertyValue('color-scheme') ===
            'dark'
          );
        },
        { timeout: 5000 },
      );
      await expectBackgroundColorToHaveCss(page, 'rgb(16, 0, 41)');
    });
  });
});
