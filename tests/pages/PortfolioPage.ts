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
  private readonly tokensFilterLocators: Locator[];
  private readonly defiProtocolsFilterLocators: Locator[];

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

    this.tokensFilterLocators = [
      this.walletSelectFilter,
      this.chainSelectFilter,
      this.assetSelectFilter,
      this.valueSelectFilter,
      this.sortSelectFilter,
    ];

    this.defiProtocolsFilterLocators = [
      this.walletSelectFilter,
      this.chainSelectFilter,
      this.assetSelectFilter,
      this.valueSelectFilter,
    ];
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

  private async verifyFiltersVisible(filters: Locator[]): Promise<void> {
    for (const filter of filters) {
      await expect(filter).toBeVisible();
    }
  }

  async verifyFiltersAreVisibleOnTokensTab(): Promise<void> {
    await openWalletDrawer(this.page);
    const connectedWalletCount = await getConnectedWalletCount(this.page);
    await closeWalletDrawer(this.page);

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

    const filtersToCheck =
      connectedWalletCount > 1
        ? this.defiProtocolsFilterLocators
        : this.defiProtocolsFilterLocators.filter(
            (f) => f !== this.walletSelectFilter,
          );

    await this.verifyFiltersVisible(filtersToCheck);
  }

  async verifyAllFiltersAreVisible(): Promise<void> {
    await this.verifyFiltersVisible(this.tokensFilterLocators);
  }
}
