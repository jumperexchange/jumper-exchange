import { expect, type Locator, type Page } from '@playwright/test';
import {
  openWalletDrawer,
  getConnectedWalletCount,
  closeWalletDrawer,
} from '../testData/connectWalletFunctions';

export class PortfolioPage {
  private readonly getStartedButton: Locator;
  private readonly tokensTab: Locator;
  private readonly defiProtocolsTab: Locator;
  private readonly walletSelectFilter: Locator;
  private readonly chainSelectFilter: Locator;
  private readonly assetSelectFilter: Locator;
  private readonly valueSelectFilter: Locator;
  private readonly sortSelectFilter: Locator;
  private readonly clearFiltersButton: Locator;
  private readonly filterBarSkeleton: Locator;
  private readonly filterTriggerButton: Locator;
  private readonly filterModalApplyButton: Locator;
  private readonly filterModalCloseButton: Locator;
  private readonly tokensFilterLocators: Locator[];
  private readonly defiProtocolsFilterLocators: Locator[];
  private readonly portfolioHeaderOverviewElement: Locator;
  private readonly tokensOverviewElement: Locator;
  private readonly defiPositionsOverviewElement: Locator;
  public readonly depositButton: Locator;
  public readonly withdrawButton: Locator;
  private readonly gearBoxPositionCard: Locator;
  private readonly depositModalTitle: Locator;
  private readonly withdrawModalTitle: Locator;
  public readonly closeModalButton: Locator;

  constructor(private readonly page: Page) {
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
    this.depositModalTitle = this.page.locator(
      'xpath=//p[normalize-space(text())="Quick deposit"]',
    );
    this.closeModalButton = this.page.getByTestId('CloseIcon');
    this.withdrawModalTitle = this.page.locator(
      'xpath=//p[normalize-space(text())="Withdraw"]',
    );

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
    this.gearBoxPositionCard = this.page.locator(
      'xpath=//div[@aria-label="Position card for gearbox protocol"]',
    );
  }

  async clickGetStartedButton(): Promise<void> {
    await this.getStartedButton.click();
  }

  async clickTokensTab(): Promise<void> {
    await this.tokensTab.click();
  }

  async clickDefiProtocolsTab(): Promise<void> {
    await this.defiProtocolsTab.click();
  }

  async verifyGetStartedButtonIsVisible(): Promise<void> {
    await expect(this.getStartedButton).toBeVisible();
  }

  async verifyTabsAreVisible(): Promise<void> {
    await expect(this.tokensTab).toBeVisible();
    await expect(this.defiProtocolsTab).toBeVisible();
  }

  async waitForFilterBarReady(): Promise<void> {
    await this.filterBarSkeleton.waitFor({ state: 'hidden', timeout: 30000 });
    await this.filterTriggerButton.waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  async openFilterModal(): Promise<void> {
    await this.filterTriggerButton.click();
    await this.filterModalApplyButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async closeFilterModal(): Promise<void> {
    await this.filterModalCloseButton.click();
    await this.filterModalCloseButton.waitFor({
      state: 'hidden',
      timeout: 5000,
    });
  }

  private async verifyFiltersVisible(filters: Locator[]): Promise<void> {
    for (const filter of filters) {
      await expect(filter).toBeVisible();
    }
  }

  async verifyFiltersAreVisibleOnTokensTab(): Promise<void> {
    await openWalletDrawer(this.page);
    const connectedWalletCount = await getConnectedWalletCount(this.page);
    await closeWalletDrawer(this.page);

    await this.waitForFilterBarReady();

    const filtersToCheck =
      connectedWalletCount > 1
        ? this.tokensFilterLocators
        : this.tokensFilterLocators.filter(
            (f) => f !== this.walletSelectFilter,
          );

    await expect(this.filterTriggerButton).toBeVisible();
    await this.openFilterModal();
    await this.verifyFiltersVisible(filtersToCheck);
    await this.closeFilterModal();
  }

  async verifyFiltersAreVisibleOnDefiProtocolsTab(): Promise<void> {
    await openWalletDrawer(this.page);
    const connectedWalletCount = await getConnectedWalletCount(this.page);
    await closeWalletDrawer(this.page);

    await this.waitForFilterBarReady();

    const filtersToCheck =
      connectedWalletCount > 1
        ? this.defiProtocolsFilterLocators
        : this.defiProtocolsFilterLocators.filter(
            (f) => f !== this.walletSelectFilter,
          );

    await expect(this.filterTriggerButton).toBeVisible();
    await this.openFilterModal();
    await this.verifyFiltersVisible(filtersToCheck);
    await this.closeFilterModal();
  }

  async verifyAllFiltersAreVisible(): Promise<void> {
    await this.waitForFilterBarReady();
    await expect(this.filterTriggerButton).toBeVisible();
  }

  async getValueSelectFilterText(): Promise<string | null> {
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

  async clickClearFiltersButton(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.clearFiltersButton.waitFor({
      state: 'hidden',
      timeout: 5000,
    });
  }

  async verifyValueSelectFilterIsVisible(): Promise<void> {
    await this.waitForFilterBarReady();
    await this.openFilterModal();
    await expect(this.valueSelectFilter).toBeVisible();
  }

  async verifyValueSelectFilterIsCleared(): Promise<void> {
    await this.openFilterModal();
    const valueText = await this.getValueSelectFilterText();
    if (valueText !== null) {
      throw new Error(
        `Value filter still contains value range after clearing: ${valueText}`,
      );
    }
    await this.closeFilterModal();
  }

  extractNumber(label: string | null): number {
    expect(label).not.toBeNull();

    return Number(
      label!.replace('Total value: ', '').replace(/[^0-9.-]+/g, ''),
    );
  }

  async verifyMainTotalValueEqualsSumOfIndividualValues(): Promise<void> {
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

    if (!isDifferenceZero) {
      throw new Error(
        `Total value does not equal sum of individual values. Difference: ${difference}`,
      );
    }
  }

  async expandSparkPositionCard(): Promise<void> {
    await this.gearBoxPositionCard.click();
  }

  async verifyDepositButtonIsVisibleOnDeFiPositionsTab(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.depositButton).toBeVisible({ timeout: 30000 });
  }

  async verifyDepositModalIsVisible(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.depositModalTitle).toBeVisible();
  }

  async verifyWithdrawButtonIsVisibleOnDeFiPositionsTab(): Promise<void> {
    await expect(this.withdrawButton).toBeVisible();
  }
  async verifyWithdrawModalIsVisible(): Promise<void> {
    await expect(this.withdrawModalTitle).toBeVisible();
  }
}
