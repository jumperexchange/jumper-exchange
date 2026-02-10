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
  private readonly filterBarContent: Locator;
  private readonly filterBarSkeleton: Locator;
  private readonly tokensFilterLocators: Locator[];
  private readonly defiProtocolsFilterLocators: Locator[];
  private readonly portfolioHeaderOverviewElement: Locator;
  private readonly tokensOverviewElement: Locator;
  private readonly defiPositionsOverviewElement: Locator;

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
    this.clearFiltersButton = this.page.getByTestId(
      'portfolio-filter-clear-filters-button',
    );
    this.filterBarContent = this.page.getByTestId(
      'portfolio-filter-bar-content',
    );
    this.filterBarSkeleton = this.page.getByTestId(
      'portfolio-filter-bar-skeleton',
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
    // Wait for skeleton to disappear and content to appear
    await this.filterBarSkeleton.waitFor({ state: 'hidden', timeout: 30000 });
    await this.filterBarContent.waitFor({ state: 'visible', timeout: 30000 });
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

    await this.verifyFiltersVisible(filtersToCheck);
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

    await this.verifyFiltersVisible(filtersToCheck);
  }

  async verifyAllFiltersAreVisible(): Promise<void> {
    await this.waitForFilterBarReady();
    await this.verifyFiltersVisible(this.tokensFilterLocators);
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
  }

  async verifyValueSelectFilterIsVisible(): Promise<void> {
    await this.waitForFilterBarReady();
    await expect(this.valueSelectFilter).toBeVisible();
  }

  async verifyValueSelectFilterIsCleared(): Promise<void> {
    const valueText = await this.getValueSelectFilterText();
    if (valueText !== null) {
      throw new Error(
        `Value filter still contains value range after clearing: ${valueText}`,
      );
    }
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
}
