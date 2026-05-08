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
      const mainMenu = new MainMenuPage(page);
      await mainMenu.headerMissionTab.click();

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
      // TODO(app): JUM-924 — add `learn-page` data-testid so we can drop
      // the `.learn-page` CSS-class anchor.
      await expect(page.locator('.learn-page')).toBeVisible();
      await mainMenu.expectHeaderTabs();

      const articlesGrid = page.getByTestId('blog-articles-cards-grid');
      await articlesGrid.scrollIntoViewIfNeeded();
      await expect(articlesGrid).toBeVisible();
      await expect(page.getByTestId('blog-articles-tab-all')).toBeVisible();
      const firstArticleCard = articlesGrid.locator('a').first();
      await expect(firstArticleCard).toBeVisible();
      await firstArticleCard.click();
      // Wait for the article URL specifically — the listing is at /learn,
      // an article is at /learn/<slug>. If the click didn't navigate
      // (intercepted by a Strapi loading skeleton, or the wrong anchor was
      // matched by .first()), this fails fast with a clear "didn't leave
      // the listing" message instead of a misleading heading-not-visible.
      await page.waitForURL(new RegExp(`${URLS.LEARN_LOCAL}/[^/].*`), {
        timeout: 30_000,
      });
      await page.waitForLoadState('load');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
        timeout: 30_000,
      });
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
      // 30s timeout: Scan page navigation is slow on prod (observed 20s in
      // smoke runs); the default 10s flakes intermittently.
      await expect(page).toHaveURL(
        new RegExp(String.raw`${URLS.SCAN_LOCAL}(?:/|$|\?)`),
        { timeout: 30_000 },
      );
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
      await mainMenu.openNewTabAndExpectUrl(context, URLS.GITHUB, () =>
        mainMenu.clickMenuItem('Github'),
      );
    },
  );

  test(
    qase(16, 'Should be able to navigate to X'),
    async ({ context, page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await mainMenu.openNewTabAndExpectUrl(context, URLS.X, () =>
        landingPage.clickNavItem('X social link'),
      );
    },
  );

  test(
    qase(17, 'Should be able to navigate to Discord'),
    async ({ context, page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await mainMenu.openNewTabAndExpectUrl(context, URLS.DISCORD, () =>
        landingPage.clickNavItem('Discord social link'),
      );
    },
  );

  test(
    qase(18, 'Should be able to navigate to Telegram'),
    async ({ context, page }) => {
      const landingPage = new LandingPage(page);
      const mainMenu = new MainMenuPage(page);
      await mainMenu.openNewTabAndExpectUrl(context, URLS.TELEGRAM, () =>
        landingPage.clickNavItem('Telegram social link'),
      );
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
      await mainMenu.openNewTabAndExpectUrl(context, URLS.LINK3, () =>
        landingPage.clickNavItem('Link3 social link'),
      );
    },
  );

  test(
    qase(37, 'Should be able to navigate to the Privacy Policy page'),
    async ({ page }) => {
      await new LandingPage(page).clickNavItem('Privacy Policy');
      // 30s timeout: the static marketing page can be slow on prod (observed
      // staying at "/" through the default 10s — same pattern as D10c).
      await expect(page).toHaveURL(
        new RegExp(String.raw`${URLS.PRIVACY_POLICY}(?:$|\?|#)`),
        { timeout: 30_000 },
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
        new RegExp(String.raw`${URLS.TERMS_OF_BUSINESS}(?:$|\?|#)`),
      );
    },
  );

  test(qase(55, 'Should be able to open newsletter page'), async ({ page }) => {
    await new LandingPage(page).clickNavItem('Newsletter');
    // 30s timeout: same Strapi-driven slow-page pattern as Privacy Policy / Scan.
    await expect(page).toHaveURL(
      new RegExp(String.raw`${URLS.NEWSLETTER}(?:$|\?|#)`),
      {
        timeout: 30_000,
      },
    );
  });
});
