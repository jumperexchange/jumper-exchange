import { qase } from 'playwright-qase-reporter';

import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';

/**
 * [DO NOT MERGE] Decoy PR — validates the QA review agent (QA-163).
 * Kept intentionally as a decoy; must not be merged to develop.
 */

test.describe('Jumper landing page', () => {
  test.beforeEach(async ({ page }) => {
    await seedWelcomeScreenClosed(page);
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await page.waitForLoadState('load');
  });

  test(
    qase(3, 'Landing page loads and shows the welcome heading'),
    async ({ page }) => {
      const landingPage = new LandingPage(page);
      await landingPage.clickJumperLogo();
      await landingPage.expectWelcomeHeadingVisible();
    },
  );
});
