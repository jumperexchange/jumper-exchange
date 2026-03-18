import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { triggerButtonClick } from './testData/commonFunctions';
import {
  connectButton,
  expectSelectWalletOptionToBeVisible,
  selectWalletOption,
} from './testData/connectWalletFunctions';
import {
  closeWelcomeScreen,
  itemInMenu,
  itemInNavigation,
} from './testData/landingPageFunctions';
import {
  checkSocialNetworkIcons,
  checkTabsInHeader,
  checkTheNumberOfMenuItems,
  openLeaderboardPage,
  openNewTabAndVerifyUrl,
  openOrCloseMainMenu,
} from './testData/menuFunctions';
import values from './testData/values.json' with { type: 'json' };
import { injectMockWallet } from './utils/mockWallet';
import {
  clickOnFirstTransaction,
  expectToBeOnTransactionPage,
} from './pages/ScanPage';

test.describe('Main Menu flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
    await openOrCloseMainMenu(page);
  });

  test(
    qase(12, 'Should be able to open menu and close it'),
    async ({ page }) => {
      await checkTheNumberOfMenuItems(page, 6);
      await page.locator('body').click();
      await expect(page.getByRole('menu')).not.toBeVisible();
    },
  );

  test(
    qase(9, 'Should be able to open mission page and then open the mission'),
    async ({ page }) => {
      const missionsButton = page.getByTestId('navbar-missions-button');
      await missionsButton.click();

      // Click on the first mission card
      const firstMissionCard = page
        .locator('[data-testid^="mission-card-"]')
        .first();
      await firstMissionCard.click();

      // Verify we're on a mission details page by checking the mission card is visible
      const missionDetailsCard = page
        .locator('[data-testid^="mission-card-"]')
        .first();
      await expect(missionDetailsCard).toBeVisible();
    },
  );

  test(
    qase(22, 'Should be able to navigate to the Jumper Learn'),
    async ({ page }) => {
      const socialNetworks = ['LinkedIn', 'Facebook', 'X'];
      await itemInMenu(page, 'Learn');
      await expect(page).toHaveURL(
        (url) =>
          url.pathname === values.localLearnURL ||
          url.pathname.startsWith(`${values.localLearnURL}/`),
      );
      await page.waitForLoadState('load');
      await expect(page.locator('.learn-page')).toBeVisible();
      await checkTabsInHeader(page);
      // Wait for the articles section to finish loading (client-side): grid visible and at least one card
      const articlesGrid = page.getByTestId('blog-articles-cards-grid');
      await articlesGrid.scrollIntoViewIfNeeded();
      await expect(articlesGrid).toBeVisible();
      await expect(page.getByTestId('blog-articles-tab-all')).toBeVisible();
      const firstArticleCard = articlesGrid.locator('a').first();
      await expect(firstArticleCard).toBeVisible();
      await firstArticleCard.click();
      await page.waitForLoadState('load');
      const articleTitle = page.getByRole('heading', { level: 1 });
      await expect(articleTitle).toBeVisible();
      await checkSocialNetworkIcons(page, socialNetworks);
    },
  );

  test(
    qase(13, 'Should open Resources section inside menu'),
    async ({ page }) => {
      await itemInMenu(page, 'Resources');
      await checkTheNumberOfMenuItems(page, 2);
    },
  );

  test(
    qase(14, 'Should open Language section inside menu'),
    async ({ page }) => {
      await itemInMenu(page, 'Language');
      await checkTheNumberOfMenuItems(page, 14);
    },
  );

  test(
    qase(21, 'Should be able to navigate to LI.FI Scan'),
    async ({ page }) => {
      await itemInMenu(page, 'Scan');
      await expect(page).toHaveURL(values.localJumperScanURL);
      await checkTabsInHeader(page);
      await clickOnFirstTransaction(page);
      await expectToBeOnTransactionPage(page);
    },
  );

  test(
    qase(15, 'Should open Github page inside Resources section'),
    async ({ page, context }) => {
      await itemInMenu(page, 'Resources');
      await itemInMenu(page, 'Github');
      await openNewTabAndVerifyUrl(context, values.githubURL);
    },
  );

  test(
    qase(16, 'Should be able to navigate to X'),
    async ({ page, context }) => {
      await itemInNavigation(page, 'X social link');
      await openNewTabAndVerifyUrl(context, values.xUrl);
    },
  );

  test(
    qase(17, 'Should be able to navigate to Discord'),
    async ({ page, context }) => {
      await itemInNavigation(page, 'Discord social link');
      await openNewTabAndVerifyUrl(context, values.discordURL);
    },
  );

  test(
    qase(18, 'Should be able to navigate to Telegram'),
    async ({ page, context }) => {
      await itemInNavigation(page, 'Telegram social link');
      await openNewTabAndVerifyUrl(context, values.telegramURL);
    },
  );

  test(
    qase(19, 'Should be able to navigate to Link3'),
    async ({ page, context }) => {
      await itemInNavigation(page, 'Link3 social link');
      await openNewTabAndVerifyUrl(context, values.link3URL);
    },
  );

  test(
    qase(37, 'Should be able to navigate to the Privacy Policy page'),
    async ({ page }) => {
      await itemInNavigation(page, 'Privacy Policy');
      await expect(page).toHaveURL(values.privacyPolicyURL);
    },
  );

  test(
    qase(20, 'Should be able to click on the Support button'),
    async ({ page }) => {
      await itemInMenu(page, 'Support');
      const iFrameLocator = page.frameLocator(
        'iframe[name="intercom-messenger-frame"]',
      );

      const messagesTab = await iFrameLocator.locator(
        '[aria-label*="Messages"]',
      );
      await expect(messagesTab).toBeVisible();
      await messagesTab.click();

      const contactSupportButton = await iFrameLocator.locator(
        '[aria-label*="Contact support"]',
      );
      await expect(contactSupportButton).toBeVisible();
      await contactSupportButton.click();

      await page.waitForLoadState('networkidle');

      const sendMessageInIframe = await iFrameLocator.locator(
        '[aria-label*="Send a message"]',
      );
      await expect(sendMessageInIframe).toBeVisible();
      await expect(sendMessageInIframe).not.toBeEnabled();

      const messageInput = await iFrameLocator.locator(
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
      await itemInNavigation(page, 'Terms Of Business');
      await expect(page).toHaveURL(values.termsOfBusinessURL);
    },
  );

  test(qase(55, 'Should be able to open newsletter page'), async ({ page }) => {
    await itemInNavigation(page, 'Newsletter');
    await expect(page).toHaveURL(values.newsletterPageURL);
  });
});

test.describe('Profile and Leaderboard navigation with wallet', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/');
    await closeWelcomeScreen(page);
    await connectButton(page).click();
    await expectSelectWalletOptionToBeVisible(page);
    await selectWalletOption(page, 'MetaMask');
    await openOrCloseMainMenu(page);
  });

  test(
    qase(
      10,
      'Should open the Jumper Profile page and then open the leaderboard page',
    ),
    async ({ page }) => {
      const leaderboardPageTitle = page.getByText('Leaderboard', {
        exact: true,
      });
      await triggerButtonClick(page, 'Pass');
      await openLeaderboardPage(page);
      await expect(leaderboardPageTitle).toBeVisible();
    },
  );
});
