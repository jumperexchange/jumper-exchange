import { expect, type Locator, type Page } from '@playwright/test';

export class PortfolioPage {
  constructor(private readonly page: Page) {}

  get getStartedButton(): Locator {
    return this.page.locator('#portfolio-get-started-button');
  }

  get tokensTab(): Locator {
    return this.page.getByTestId('portfolio-filter-tab-tokens');
  }

  get defiProtocolsTab(): Locator {
    return this.page.getByTestId('portfolio-filter-tab-defi-protocols');
  }

  get walletSelectFilter(): Locator {
    return this.page.getByTestId('portfolio-filter-wallet-select');
  }

  get chainSelectFilter(): Locator {
    return this.page.getByTestId('portfolio-filter-chain-select');
  }

  get assetSelectFilter(): Locator {
    return this.page.getByTestId('portfolio-filter-asset-select');
  }

  get valueSelectFilter(): Locator {
    return this.page.getByTestId('portfolio-filter-value-select');
  }

  get sortSelectFilter(): Locator {
    return this.page.getByTestId('portfolio-filter-sort-select');
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

  async verifyFiltersAreVisibleOnTokensTab(): Promise<void> {
    const filterIds = [
      'portfolio-filter-wallet-select',
      'portfolio-filter-chain-select',
      'portfolio-filter-asset-select',
      'portfolio-filter-value-select',
      'portfolio-filter-sort-select',
    ];
    for (const filterId of filterIds) {
      await expect(this.page.getByTestId(filterId)).toBeVisible();
    }
  }

  async verifyFiltersAreVisibleOnDefiProtocolsTab(): Promise<void> {
    const filterIds = [
      'portfolio-filter-wallet-select',
      'portfolio-filter-chain-select',
      'portfolio-filter-asset-select',
      'portfolio-filter-value-select',
    ];
    for (const filterId of filterIds) {
      await expect(this.page.getByTestId(filterId)).toBeVisible();
    }
  }

  async verifyAllFiltersAreVisible(): Promise<void> {
    await expect(this.walletSelectFilter).toBeVisible();
    await expect(this.chainSelectFilter).toBeVisible();
    await expect(this.assetSelectFilter).toBeVisible();
    await expect(this.valueSelectFilter).toBeVisible();
  }
}
