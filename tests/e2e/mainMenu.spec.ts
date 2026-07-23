import { expect } from '@playwright/test';

import { URLS } from './data/urls';
import { noWalletTest as test } from './fixtures/noWallet';
import { LandingPage } from './pages/LandingPage';
import { MainMenuPage } from './pages/MainMenuPage';
import { ScanPage } from './pages/ScanPage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';
const NAV_TIMEOUT_MS = 30_000;

test.describe('Main Menu flows', () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await seedWelcomeScreenClosed(page);
    await landingPage.goto();
    await new MainMenuPage(page).open();
  });

  test('Should be able to open menu and close it', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.expectItemCount(7);
    await page.locator('body').click();
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('Should be able to open mission page and then open the mission', async ({
    page,
  }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.headerMissionTab.click();
    await expect(page.getByTestId('missions-list')).toBeVisible();

    // Develop Strapi also serves legacy /quests/ cards whose slugs may not resolve.
    const firstMissionCard = page
      .locator('a[href^="/missions/"]')
      .filter({ has: page.locator('[data-testid^="mission-card-"]') })
      .first();
    await firstMissionCard.click();

    await expect(page.getByTestId('mission-details')).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
  });

  test('Should be able to navigate to the Jumper Learn', async ({ page }) => {
    test.slow(); // marketing/strapi content; CI ~38s navigation
    const mainMenu = new MainMenuPage(page);
    await mainMenu.clickMenuItem('Learn');
    await expect(page).toHaveURL(
      (url) =>
        url.pathname === URLS.LEARN_LOCAL ||
        url.pathname.startsWith(`${URLS.LEARN_LOCAL}/`),
      { timeout: 60_000 },
    );
    await page.waitForLoadState('load');
    await expect(page.getByTestId('learn-page')).toBeVisible();
    await mainMenu.expectHeaderTabs();

    const articlesGrid = page.getByTestId('blog-articles-cards-grid');
    await articlesGrid.scrollIntoViewIfNeeded();
    await expect(articlesGrid).toBeVisible();
    await expect(page.getByTestId('blog-articles-tab-all')).toBeVisible();
    const firstArticleCard = articlesGrid.locator('a').first();
    await expect(firstArticleCard).toBeVisible();
    await firstArticleCard.click();
    // waitForURL fails fast if the click didn't navigate off the listing.
    await page.waitForURL(new RegExp(`${URLS.LEARN_LOCAL}/[^/].*`), {
      timeout: NAV_TIMEOUT_MS,
    });
    await page.waitForLoadState('load');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
    await mainMenu.expectSocialIcons(['LinkedIn', 'Facebook', 'X']);
  });

  test('Should open Resources section inside menu', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.clickMenuItem('Resources');
    await mainMenu.expectItemCount(2);
  });

  test('Should open Language section inside menu', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.clickMenuItem('Language');
    await mainMenu.expectItemCount(14);
  });

  test('Should be able to navigate to LI.FI Scan', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.clickMenuItem('Scan');
    await expect(page).toHaveURL(
      new RegExp(String.raw`${URLS.SCAN_LOCAL}(?:/|$|\?)`),
      { timeout: NAV_TIMEOUT_MS },
    );
    await mainMenu.expectHeaderTabs();
    const scanPage = new ScanPage(page);
    await scanPage.clickFirstTransaction();
    await scanPage.expectOnTransactionPage();
  });

  test('Should open Github page inside Resources section', async ({
    context,
    page,
  }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.clickMenuItem('Resources');
    await mainMenu.openNewTabAndExpectUrl(context, URLS.GITHUB, () =>
      mainMenu.clickMenuItem('Github'),
    );
  });

  test('Should be able to navigate to X', async ({ context, page }) => {
    const landingPage = new LandingPage(page);
    const mainMenu = new MainMenuPage(page);
    await mainMenu.openNewTabAndExpectUrl(context, URLS.X, () =>
      landingPage.clickNavItem('X social link'),
    );
  });

  test('Should be able to navigate to Discord', async ({ context, page }) => {
    const landingPage = new LandingPage(page);
    const mainMenu = new MainMenuPage(page);
    await mainMenu.openNewTabAndExpectUrl(context, URLS.DISCORD, () =>
      landingPage.clickNavItem('Discord social link'),
    );
  });

  test('Should be able to navigate to Telegram', async ({ context, page }) => {
    const landingPage = new LandingPage(page);
    const mainMenu = new MainMenuPage(page);
    await mainMenu.openNewTabAndExpectUrl(context, URLS.TELEGRAM, () =>
      landingPage.clickNavItem('Telegram social link'),
    );
  });

  // link3.to TCP-times-out (2026-05-08); destination is down, our link is correct.
  test.fixme('Should be able to navigate to Link3', async ({
    context,
    page,
  }) => {
    const landingPage = new LandingPage(page);
    const mainMenu = new MainMenuPage(page);
    await mainMenu.openNewTabAndExpectUrl(context, URLS.LINK3, () =>
      landingPage.clickNavItem('Link3 social link'),
    );
  });

  test('Should be able to navigate to the Privacy Policy page', async ({
    page,
  }) => {
    await new LandingPage(page).clickNavItem('Privacy Policy');
    await expect(page).toHaveURL(
      new RegExp(String.raw`${URLS.PRIVACY_POLICY}(?:$|\?|#)`),
      { timeout: NAV_TIMEOUT_MS },
    );
  });

  // JUM-1116: Intercom is gated behind the LCP web-vital (IntercomProvider.tsx), which doesn't
  // reliably fire in headless CI → Intercom never boots and the messenger iframe never mounts, so
  // this assertion can't pass (8/15 in CI; confirmed via trace + local LCP-block A/B). Re-enable
  // when Intercom boots deterministically in CI (test-side LCP trigger or an app test-flag).
  test.fixme('Should be able to click on the Support button', async ({
    page,
  }) => {
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
    await expect(sendMessageInIframe).toBeVisible({
      timeout: NAV_TIMEOUT_MS,
    });
    await expect(sendMessageInIframe).toBeDisabled();

    const messageInput = iFrameLocator.locator(
      'textarea[aria-label*="Message"]',
    );
    await messageInput.focus();
    await messageInput.fill('Hello, how are you?');

    await expect(sendMessageInIframe).toBeEnabled();
  });

  test('Should be able to navigate to the Terms Of Business page', async ({
    page,
  }) => {
    await new LandingPage(page).clickNavItem('Terms Of Business');
    await expect(page).toHaveURL(
      new RegExp(String.raw`${URLS.TERMS_OF_BUSINESS}(?:$|\?|#)`),
    );
  });

  test('Should be able to open newsletter page', async ({ page }) => {
    await new LandingPage(page).clickNavItem('Newsletter');
    await expect(page).toHaveURL(
      new RegExp(String.raw`${URLS.NEWSLETTER}(?:$|\?|#)`),
      {
        timeout: NAV_TIMEOUT_MS,
      },
    );
  });
});
