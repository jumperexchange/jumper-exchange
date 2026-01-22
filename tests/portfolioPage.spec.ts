import test from '@playwright/test';
import {
  connectButton,
  expectSelectWalletOptionToBeVisible,
  selectWalletOption,
} from './testData/connectWalletFunctions';
import { PortfolioPage } from './pages/PortfolioPage';
import { injectMockWallet } from './utils/mockWallet';
import { qase } from 'playwright-qase-reporter';

test.describe('Portfolio page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/portfolio');
    await connectButton(page).click();
    await expectSelectWalletOptionToBeVisible(page);
    await selectWalletOption(page, 'MetaMask');
  });

  test.describe('Verify elements and filters on portfolio page', () => {
    test(qase(52, 'verify welcome screen is visible'), async ({ page }) => {
      const portfolioPage = new PortfolioPage(page);
      await portfolioPage.verifyGetStartedButtonIsVisible();
    });

    test(
      qase(
        53,
        'verify portfolio page elements and filters on Tokens and DeFi Protocols tabs',
      ),
      async ({ page }) => {
        const portfolioPage = new PortfolioPage(page);

        await test.step('verify get started button is visible and close welcome screen', async () => {
          await portfolioPage.verifyGetStartedButtonIsVisible();
          await portfolioPage.clickGetStartedButton();
        });

        await test.step('verify Tokens and DeFi Protocols tabs are visible', async () => {
          await portfolioPage.verifyTabsAreVisible();
        });

        await test.step('verify filters are visible on Tokens tab', async () => {
          await portfolioPage.verifyFiltersAreVisibleOnTokensTab();
        });

        await test.step('verify filters are visible on DeFi Protocols tab', async () => {
          await portfolioPage.clickDefiProtocolsTab();
          await portfolioPage.verifyFiltersAreVisibleOnDefiProtocolsTab();
        });
      },
    );

    test(
      qase(
        57,
        'verify value filter is cleared when clicking clear filter button',
      ),
      async ({ page }) => {
        const portfolioPage = new PortfolioPage(page);
        await portfolioPage.verifyValueSelectFilterIsVisible();

        await test.step('click clear filters button', async () => {
          await portfolioPage.clickClearFiltersButton();
        });

        await test.step('verify value filter is cleared', async () => {
          await portfolioPage.verifyValueSelectFilterIsCleared();
        });
      },
    );
  });
});
