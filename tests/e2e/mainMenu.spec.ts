import { qase } from 'playwright-qase-reporter';

import { URLS } from './data';
import { expect, noWalletTest as test } from './fixtures';
import { LandingPage, MainMenuPage, ScanPage } from './pages';

test.describe('Main Menu flows', () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.closeWelcomeScreen();
    await new MainMenuPage(page).open();
  });

  test(
    qase(12, 'Should be able to open menu and close it'),
    async ({ page }) => {
      const mainMenu = new MainMenuPage(page);
      await mainMenu.expectItemCount(6);
      await page.locator('body').click();
      await expect(page.getByRole('menu')).toBeHidden();
    },
  );

  test(
    qase(9, 'Should be able to open mission page and then open the mission'),
    async ({ page }) => {
      const missionsButton = page.getByTestId('navbar-missions-button');
      await missionsButton.click();

      const firstMissionCard = page
        .locator('[data-testid^="mission-card-"]')
        .first();
      await firstMissionCard.click();

      const missionDetailsCard = page
        .locator('[data-testid^="mission-card-"]')
        .first();
      await expect(missionDetailsCard).toBeVisible();
    },
  );

  test(
    qase(22, 'Should be able to navigate to the Jumper Learn'),
    async ({ page }) => {
      // Learn loads marketing/strapi content; CI sees ~38s navigation time.
      test.slow();
      const mainMenu = new MainMenuPage(page);
      await mainMenu.clickMenuItem('Learn');
      await expect(page).toHaveURL(
        (url) =>
          url.pathname === URLS.LEARN_LOCAL ||
          url.pathname.startsWith(`${URLS.LEARN_LOCAL}/`),
        { timeout: 60_000 },
      );
      await page.waitForLoadState('load');
      await expect(page.locator('.learn-page')).toBeVisible();
      await mainMenu.expectHeaderTabs();

      const articlesGrid = page.getByTestId('blog-articles-cards-grid');
      await articlesGrid.scrollIntoViewIfNeeded();
      await expect(articlesGrid).toBeVisible();
      await expect(page.getByTestId('blog-articles-tab-all')).toBeVisible();
      const firstArticleCard = articlesGrid.locator('a').first();
      await expect(firstArticleCard).toBeVisible();
      await firstArticleCard.click();
      await page.waitForLoadState('load');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await mainMenu.expectSocialIcons(['LinkedIn', 'Facebook', 'X']);
    },
  );

  test(
    qase(13, 'Should open Resources section inside menu'),
    async ({ page }) => {
      const mainMenu = new MainMenuPage(page);
      await mainMenu.clickMenuItem('Resources');
      await mainMenu.expectItemCount(2);
    },
  );

  test(
    qase(14, 'Should open Language section inside menu'),
    async ({ page }) => {
      const mainMenu = new MainMenuPage(page);
      await mainMenu.clickMenuItem('Language');
      await mainMenu.expectItemCount(14);
    },
  );

  test(
    qase(21, 'Should be able to navigate to LI.FI Scan'),
    async ({ page }) => {
      const mainMenu = new MainMenuPage(page);
      await mainMenu.clickMenuItem('Scan');
      // Host-agnostic: Jumper canonical host is jumper.xyz, with jumper.exchange
      // redirecting; assert on the path only so either host resolves.
      await expect(page).toHaveURL(new RegExp(`${URLS.SCAN_LOCAL}(?:/|$|\\?)`));
      await mainMenu.expectHeaderTabs();
      const scanPage = new ScanPage(page);
      await scanPage.clickFirstTransaction();
      await scanPage.expectOnTransactionPage();
    },
  );

  test(
    qase(15, 'Should open Github page inside Resources section'),
    async ({ context, page }) => {
      const mainMenu = new MainMenuPage(page);
      await mainMenu.clickMenuItem('Resources');
      await mainMenu.clickMenuItem('Github');
      await mainMenu.openNewTabAndExpectUrl(context, URLS.GITHUB);
    },
  );

  test(
    qase(16, 'Should be able to navigate to X'),
    async ({ context, page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.clickNavItem('X social link');
      await mainMenu.openNewTabAndExpectUrl(context, URLS.X);
    },
  );

  test(
    qase(17, 'Should be able to navigate to Discord'),
    async ({ context, page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.clickNavItem('Discord social link');
      await mainMenu.openNewTabAndExpectUrl(context, URLS.DISCORD);
    },
  );

  test(
    qase(18, 'Should be able to navigate to Telegram'),
    async ({ context, page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.clickNavItem('Telegram social link');
      await mainMenu.openNewTabAndExpectUrl(context, URLS.TELEGRAM);
    },
  );

  test(
    qase(19, 'Should be able to navigate to Link3'),
    async ({ context, page }) => {
      // link3.to is currently unreachable — DNS resolves but TCP times out
      // (verified 2026-05-08 via direct curl on the bare domain). The link
      // in Jumper's footer is correct; the destination's server is down.
      // Re-enable once link3.to is reachable again, or remove if Jumper
      // drops the link3 footer link.
      test.fixme();
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await landingPage.clickNavItem('Link3 social link');
      await mainMenu.openNewTabAndExpectUrl(context, URLS.LINK3);
    },
  );

  test(
    qase(37, 'Should be able to navigate to the Privacy Policy page'),
    async ({ page }) => {
      await new LandingPage(page).clickNavItem('Privacy Policy');
      await expect(page).toHaveURL(
        new RegExp(`${URLS.PRIVACY_POLICY}(?:$|\\?|#)`),
      );
    },
  );

  test(
    qase(20, 'Should be able to click on the Support button'),
    async ({ page }) => {
      const mainMenu = new MainMenuPage(page);
      await mainMenu.clickMenuItem('Support');
      const iFrameLocator = page.frameLocator(
        'iframe[name="intercom-messenger-frame"]',
      );

      const messagesTab = iFrameLocator.locator('[aria-label*="Messages"]');
      await expect(messagesTab).toBeVisible();
      await messagesTab.click();

      const contactSupportButton = iFrameLocator.locator(
        '[aria-label*="Contact support"]',
      );
      await expect(contactSupportButton).toBeVisible();
      await contactSupportButton.click();

      const sendMessageInIframe = iFrameLocator.locator(
        '[aria-label*="Send a message"]',
      );
      await expect(sendMessageInIframe).toBeVisible({ timeout: 30_000 });
      await expect(sendMessageInIframe).toBeDisabled();

      const messageInput = iFrameLocator.locator(
        'textarea[aria-label*="Message"]',
      );
      await messageInput.focus();
      await messageInput.fill('Hello, how are you?');

      await expect(sendMessageInIframe).toBeEnabled();
    },
  );

  test(
    qase(54, 'Should be able to navigate to the Terms Of Business page'),
    async ({ page }) => {
      await new LandingPage(page).clickNavItem('Terms Of Business');
      await expect(page).toHaveURL(
        new RegExp(`${URLS.TERMS_OF_BUSINESS}(?:$|\\?|#)`),
      );
    },
  );

  test(qase(55, 'Should be able to open newsletter page'), async ({ page }) => {
    await new LandingPage(page).clickNavItem('Newsletter');
    await expect(page).toHaveURL(new RegExp(`${URLS.NEWSLETTER}(?:$|\\?|#)`));
  });
});
