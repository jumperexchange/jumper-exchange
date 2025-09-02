import { expect, test } from '@playwright/test';
import {
  closeWelcomeScreen,
  navigateToTab,
  clickOnJumperLogo,
} from './testData/landingPageFunctions';
import { qase } from 'playwright-qase-reporter';

test.describe('Landing page and navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test(qase(2, 'Should navigate to the homepage and change tabs'), async ({ page }) => {
    await navigateToTab(page, 1, 'Gas');
    await navigateToTab(page, 0, 'Exchange');
  });

  test(qase(1, 'Should show again welcome screen when clicking jumper logo'), async ({
    page,
  }) => {
    const headerText = 'Find the best route';
    await clickOnJumperLogo(page);
    await closeWelcomeScreen(page);
    await expect(headerText).toBe('Find the best route');
  });
});
