import { connectedTest as test } from './fixtures/connectedWallet';
import { PortfolioPage } from './pages/PortfolioPage';

test.describe('Portfolio page', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await jumperPage.goto('/portfolio');
  });

  test('verify welcome screen is visible', async ({ jumperPage }) => {
    const portfolioPage = new PortfolioPage(jumperPage);
    await portfolioPage.expectGetStartedButtonIsVisible();
  });

  // Blocked on funded QA wallet — Tokens / DeFi Protocols tabs render empty placeholders without positions.
  test.fixme('verify portfolio page elements and filters on Tokens and DeFi Protocols tabs', async ({
    jumperPage,
  }) => {
    const portfolioPage = new PortfolioPage(jumperPage);

    await test.step('verify get started button is visible and close welcome screen', async () => {
      await portfolioPage.expectGetStartedButtonIsVisible();
      await portfolioPage.clickGetStartedButton();
    });

    await test.step('verify Tokens and DeFi Protocols tabs are visible', async () => {
      await portfolioPage.expectTabsAreVisible();
    });

    await test.step('verify filters are visible on Tokens tab', async () => {
      await portfolioPage.expectFiltersAreVisibleOnTokensTab();
    });

    await test.step('verify filters are visible on DeFi Protocols tab', async () => {
      await portfolioPage.clickDefiProtocolsTab();
      await portfolioPage.expectFiltersAreVisibleOnDefiProtocolsTab();
    });
  });

  // Blocked on funded QA wallet — value filter dropdown only renders with tokens present.
  test.fixme('verify value filter is cleared when clicking clear filter button', async ({
    jumperPage,
  }) => {
    const portfolioPage = new PortfolioPage(jumperPage);
    await portfolioPage.expectGetStartedButtonIsVisible();
    await portfolioPage.clickGetStartedButton();

    await test.step('verify value filter exists', async () => {
      await portfolioPage.expectValueSelectFilterIsVisible();
    });

    await test.step('click clear filters button', async () => {
      await portfolioPage.clickClearFiltersButton();
    });

    await test.step('verify value filter is cleared', async () => {
      await portfolioPage.expectValueSelectFilterIsCleared();
    });
  });

  // Blocked on funded QA wallet — OverviewView (with the aria-label totals)
  // is only rendered when the wallet has tokens or DeFi positions.
  test.fixme('verify main total value equals sum of individual values', async ({
    jumperPage,
  }) => {
    const portfolioPage = new PortfolioPage(jumperPage);
    await portfolioPage.expectGetStartedButtonIsVisible();
    await portfolioPage.clickGetStartedButton();
    await portfolioPage.expectMainTotalValueEqualsSumOfIndividualValues();
  });

  // Blocked on funded QA wallet — relies on an active gearbox protocol position to expand.
  test.fixme('verify that deposit and withdraw buttons are visible on DeFI positions tab', async ({
    jumperPage,
  }) => {
    const portfolioPage = new PortfolioPage(jumperPage);
    await portfolioPage.expectGetStartedButtonIsVisible();
    await portfolioPage.clickGetStartedButton();

    await test.step('verify deposit/withdraw buttons on defi positions tab', async () => {
      await portfolioPage.clickDefiProtocolsTab();
      await portfolioPage.expandGearboxPositionCard();
      await portfolioPage.expectDepositButtonIsVisibleOnDeFiPositionsTab();
      await portfolioPage.expectWithdrawButtonIsVisibleOnDeFiPositionsTab();
    });

    await test.step('verify deposit modal opens and closes', async () => {
      await portfolioPage.clickDepositButton();
      await portfolioPage.expectDepositModalIsVisible();
      await portfolioPage.clickCloseModalButton();
    });

    await test.step('verify withdraw modal opens', async () => {
      await portfolioPage.clickWithdrawButton();
      await portfolioPage.expectWithdrawModalIsVisible();
    });
  });
});
