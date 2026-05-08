import { expect, type Locator, type Page } from '@playwright/test';

import { ConnectWalletPage } from './ConnectWalletPage';

export class PortfolioPage {
  public readonly closeModalButton: Locator;
  public readonly depositButton: Locator;
  public readonly withdrawButton: Locator;
  private readonly assetSelectFilter: Locator;
  private readonly chainSelectFilter: Locator;
  private readonly clearFiltersButton: Locator;
  private readonly connectWalletPage: ConnectWalletPage;
  private readonly defiPositionsOverviewElement: Locator;
  private readonly defiProtocolsFilterLocators: Locator[];
  private readonly defiProtocolsTab: Locator;
  private readonly depositModalTitle: Locator;
  private readonly filterBarSkeleton: Locator;
  private readonly filterModalApplyButton: Locator;
  private readonly filterModalCloseButton: Locator;
  private readonly filterTriggerButton: Locator;
  private readonly gearboxPositionCard: Locator;
  private readonly getStartedButton: Locator;
  private readonly portfolioHeaderOverviewElement: Locator;
  private readonly sortSelectFilter: Locator;
  private readonly tokensFilterLocators: Locator[];
  private readonly tokensOverviewElement: Locator;
  private readonly tokensTab: Locator;
  private readonly valueSelectFilter: Locator;
  private readonly walletSelectFilter: Locator;
  private readonly withdrawModalTitle: Locator;

  constructor(private readonly page: Page) {
    this.connectWalletPage = new ConnectWalletPage(page);
    this.getStartedButton = this.page.locator('#portfolio-get-started-button');
    this.tokensTab = this.page.getByTestId('portfolio-filter-tab-tokens');
    this.defiProtocolsTab = this.page.getByTestId(
      'portfolio-filter-tab-defi-protocols',
    );
    this.walletSelectFilter = this.page.getByTestId(
      'portfolio-filter-wallet-select',
    );
    this.chainSelectFilter = this.page.getByTestId(
      'portfolio-filter-chain-select',
    );
    this.assetSelectFilter = this.page.getByTestId(
      'portfolio-filter-asset-select',
    );
    this.valueSelectFilter = this.page.getByTestId(
      'portfolio-filter-value-select',
    );
    this.sortSelectFilter = this.page.getByTestId(
      'portfolio-filter-sort-select',
    );
    this.clearFiltersButton = this.page
      .getByTestId('portfolio-filters-desktop-modal-clear-all-button')
      .or(
        this.page.getByTestId(
          'portfolio-filters-mobile-drawer-clear-all-button',
        ),
      );
    this.filterBarSkeleton = this.page.getByTestId(
      'portfolio-filter-bar-skeleton',
    );
    this.filterTriggerButton = this.page
      .getByTestId('portfolio-filters-desktop-modal-trigger-button')
      .or(
        this.page.getByTestId('portfolio-filters-mobile-drawer-trigger-button'),
      );
    this.filterModalApplyButton = this.page
      .getByTestId('portfolio-filters-desktop-modal-apply-button')
      .or(
        this.page.getByTestId('portfolio-filters-mobile-drawer-apply-button'),
      );
    this.filterModalCloseButton = this.page
      .getByTestId('modal-close-button')
      .or(this.page.getByTestId('drawer-close-button'));
    this.depositModalTitle = this.page.getByText('Quick deposit', {
      exact: true,
    });
    // MUI v9 dropped auto data-testid on icon SVGs; fall back to the close
    // button's accessible name (or the modal-close-button testid if the app
    // exposes one).
    this.closeModalButton = this.page
      .getByTestId('modal-close-button')
      .or(this.page.getByRole('button', { name: /close/i }).first());
    this.withdrawModalTitle = this.page.getByText('Withdraw', { exact: true });

    this.tokensFilterLocators = [
      this.walletSelectFilter,
      this.chainSelectFilter,
      this.assetSelectFilter,
      this.valueSelectFilter,
      this.sortSelectFilter,
      this.clearFiltersButton,
    ];

    this.defiProtocolsFilterLocators = [
      this.walletSelectFilter,
      this.chainSelectFilter,
      this.assetSelectFilter,
      this.valueSelectFilter,
      this.clearFiltersButton,
    ];

    this.portfolioHeaderOverviewElement = this.page.getByTestId(
      'portfolio-header-overview-value',
    );

    this.tokensOverviewElement = this.page.getByTestId(
      'asset-overview-card-tokens',
    );

    this.defiPositionsOverviewElement = this.page.getByTestId(
      'asset-overview-card-defi-positions',
    );
    this.depositButton = this.page
      .getByTestId('portfolio-deposit-button')
      .first();
    this.withdrawButton = this.page
      .getByTestId('portfolio-withdraw-button')
      .first();
    this.gearboxPositionCard = this.page.getByLabel(
      'Position card for gearbox protocol',
    );
  }

  async clickClearFiltersButton(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.clearFiltersButton.waitFor({
      state: 'hidden',
      timeout: 5000,
    });
  }

  async clickDefiProtocolsTab(): Promise<void> {
    await this.defiProtocolsTab.click();
  }

  async clickGetStartedButton(): Promise<void> {
    await this.getStartedButton.click();
  }

  async clickTokensTab(): Promise<void> {
    await this.tokensTab.click();
  }

  async closeFilterModal(): Promise<void> {
    await this.filterModalCloseButton.click();
    await this.filterModalCloseButton.waitFor({
      state: 'hidden',
      timeout: 5000,
    });
  }

  async expandGearboxPositionCard(): Promise<void> {
    await this.gearboxPositionCard.click();
  }

  async expectAllFiltersAreVisible(): Promise<void> {
    await this.waitForFilterBarReady();
    await expect(this.filterTriggerButton).toBeVisible();
  }

  async expectDepositButtonIsVisibleOnDeFiPositionsTab(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.depositButton).toBeVisible({ timeout: 30000 });
  }

  async expectDepositModalIsVisible(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.depositModalTitle).toBeVisible();
  }

  async expectFiltersAreVisibleOnDefiProtocolsTab(): Promise<void> {
    await this.expectTabFilters(this.defiProtocolsFilterLocators);
  }

  async expectFiltersAreVisibleOnTokensTab(): Promise<void> {
    await this.expectTabFilters(this.tokensFilterLocators);
  }

  async expectGetStartedButtonIsVisible(): Promise<void> {
    await expect(this.getStartedButton).toBeVisible();
  }

  async expectMainTotalValueEqualsSumOfIndividualValues(): Promise<void> {
    const portfolioTotalValueText =
      await this.portfolioHeaderOverviewElement.getAttribute('aria-label');

    const tokensTotalValueText =
      await this.tokensOverviewElement.getAttribute('aria-label');

    const defiPositionsTotalValueText =
      await this.defiPositionsOverviewElement.getAttribute('aria-label');

    const totalValueNum = this.extractNumber(portfolioTotalValueText);
    const tokensValueNum = this.extractNumber(tokensTotalValueText);
    const defiProtocolsValueNum = this.extractNumber(
      defiPositionsTotalValueText,
    );

    const totalValueComputedNum = tokensValueNum + defiProtocolsValueNum;
    const difference = Math.abs(totalValueComputedNum - totalValueNum);
    const isDifferenceZero = difference < Number.EPSILON;
    expect(
      isDifferenceZero,
      `Total value does not equal sum of individual values. Difference: ${difference}`,
    ).toBe(true);
  }

  async expectTabsAreVisible(): Promise<void> {
    await expect(this.tokensTab).toBeVisible();
    await expect(this.defiProtocolsTab).toBeVisible();
  }

  async expectValueSelectFilterIsCleared(): Promise<void> {
    await this.openFilterModal();
    const valueText = await this.getValueSelectFilterText();
    if (valueText !== null) {
      throw new Error(
        `Value filter still contains value range after clearing: ${valueText}`,
      );
    }
    await this.closeFilterModal();
  }

  async expectValueSelectFilterIsVisible(): Promise<void> {
    await this.waitForFilterBarReady();
    await this.openFilterModal();
    await expect(this.valueSelectFilter).toBeVisible();
  }

  async expectWithdrawButtonIsVisibleOnDeFiPositionsTab(): Promise<void> {
    await expect(this.withdrawButton).toBeVisible();
  }

  async expectWithdrawModalIsVisible(): Promise<void> {
    await expect(this.withdrawModalTitle).toBeVisible();
  }

  async getValueSelectFilterText(): Promise<null | string> {
    const paragraphs = this.valueSelectFilter.locator('p');
    const count = await paragraphs.count();
    for (let i = 0; i < count; i++) {
      const text = await paragraphs.nth(i).textContent();
      if (text && /\d+\s*-\s*\d+/.test(text.trim())) {
        return text.trim();
      }
    }
    return null;
  }

  async openFilterModal(): Promise<void> {
    await this.filterTriggerButton.click();
    await this.filterModalApplyButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async waitForFilterBarReady(): Promise<void> {
    await this.filterBarSkeleton.waitFor({ state: 'hidden', timeout: 30000 });
    await this.filterTriggerButton.waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  private async expectFiltersVisible(filters: Locator[]): Promise<void> {
    for (const filter of filters) {
      await expect(filter).toBeVisible();
    }
  }

  // Shared body for the per-tab filter assertions. The wallet-select filter
  // only renders when more than one wallet is connected, so the per-tab
  // method passes its full filter list and the helper drops `walletSelectFilter`
  // when only one wallet is connected.
  private async expectTabFilters(filterLocators: Locator[]): Promise<void> {
    await this.connectWalletPage.openWalletDrawer();
    const connectedWalletCount =
      await this.connectWalletPage.getConnectedWalletCount();
    await this.connectWalletPage.closeWalletDrawer();

    await this.waitForFilterBarReady();

    const filtersToCheck =
      connectedWalletCount > 1
        ? filterLocators
        : filterLocators.filter((f) => f !== this.walletSelectFilter);

    await expect(this.filterTriggerButton).toBeVisible();
    await this.openFilterModal();
    await this.expectFiltersVisible(filtersToCheck);
    await this.closeFilterModal();
  }
  private extractNumber(label: null | string): number {
    if (label === null) {
      throw new Error('extractNumber: label is null');
    }
    return Number(label.replace('Total value: ', '').replace(/[^0-9.-]+/g, ''));
  }
}
