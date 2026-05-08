import { qase } from 'playwright-qase-reporter';

import { connectedTest as test } from './fixtures';
import { PortfolioPage } from './pages';

test.describe('Portfolio page', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await jumperPage.goto('/portfolio');
  });

  test.describe('Verify elements and filters on portfolio page', () => {
    test(
      qase(52, 'verify welcome screen is visible'),
      async ({ jumperPage }) => {
        const portfolioPage = new PortfolioPage(jumperPage);
        await portfolioPage.verifyGetStartedButtonIsVisible();
      },
    );

    test(
      qase(
        53,
        'verify portfolio page elements and filters on Tokens and DeFi Protocols tabs',
      ),
      async ({ jumperPage }) => {
        const portfolioPage = new PortfolioPage(jumperPage);

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
      async ({ jumperPage }) => {
        const portfolioPage = new PortfolioPage(jumperPage);
        await portfolioPage.verifyGetStartedButtonIsVisible();
        await portfolioPage.clickGetStartedButton();

        await test.step('verify value filter exists', async () => {
          await portfolioPage.verifyValueSelectFilterIsVisible();
        });

        await test.step('click clear filters button', async () => {
          await portfolioPage.clickClearFiltersButton();
        });

        await test.step('verify value filter is cleared', async () => {
          await portfolioPage.verifyValueSelectFilterIsCleared();
        });
      },
    );

    test('verify main total value equals sum of individual values', async ({
      jumperPage,
    }) => {
      const portfolioPage = new PortfolioPage(jumperPage);
      await portfolioPage.verifyGetStartedButtonIsVisible();
      await portfolioPage.clickGetStartedButton();
      await portfolioPage.verifyMainTotalValueEqualsSumOfIndividualValues();
    });

    test('verify that deposit and withdraw buttons are visible on DeFI positions tab', async ({
      jumperPage,
    }) => {
      const portfolioPage = new PortfolioPage(jumperPage);
      await portfolioPage.verifyGetStartedButtonIsVisible();
      await portfolioPage.clickGetStartedButton();

      await test.step('verify deposit/withdraw buttons on defi positions tab', async () => {
        await portfolioPage.clickDefiProtocolsTab();
        await portfolioPage.expandGearboxPositionCard();
        await portfolioPage.verifyDepositButtonIsVisibleOnDeFiPositionsTab();
        await portfolioPage.verifyWithdrawButtonIsVisibleOnDeFiPositionsTab();
      });

      await test.step('verify deposit modal opens and closes', async () => {
        await portfolioPage.depositButton.click();
        await portfolioPage.verifyDepositModalIsVisible();
        await portfolioPage.closeModalButton.click();
      });

      await test.step('verify withdraw modal opens', async () => {
        await portfolioPage.withdrawButton.click();
        await portfolioPage.verifyWithdrawModalIsVisible();
      });
    });
  });
});
