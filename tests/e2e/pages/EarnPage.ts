import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

const ANALYTICS_BUTTON_TESTIDS = [
  'analytics-range-week',
  'analytics-range-month',
  'analytics-range-year',
  'analytics-value-apy',
  'analytics-value-tvl',
];

const FILTER_TESTIDS = [
  'earn-filter-chain-select',
  'earn-filter-protocol-select',
  'earn-filter-tag-select',
  'earn-filter-asset-select',
  'earn-filter-apy-select',
  'earn-filter-tvl-select',
];

export class EarnPage {
  readonly allMarketsTab: Locator;
  readonly cardsGrid: Locator;
  readonly clearButton: Locator;
  readonly forYouTab: Locator;
  readonly yourPositionsTab: Locator;

  constructor(private readonly page: Page) {
    this.allMarketsTab = page.getByTestId('earn-filter-tab-all');
    this.forYouTab = page.getByTestId('earn-filter-tab-foryou');
    this.yourPositionsTab = page.getByTestId('earn-filter-tab-your-positions');
    this.cardsGrid = page.getByTestId('earn-opportunities-cards-grid');
    this.clearButton = page.getByTestId('clear-button');
  }

  async expectAllCardsShowChain(expectedChain: string): Promise<void> {
    await this.page.waitForLoadState('load');

    const chainNameElements = this.cardsGrid.getByTestId(
      'earn-card-chain-name',
    );
    await expect(chainNameElements).not.toHaveCount(0);

    const expectedPattern = new RegExp(`^${expectedChain}$`, 'i');
    const count = await chainNameElements.count();
    for (let i = 0; i < count; i++) {
      await expect(chainNameElements.nth(i)).toHaveText(expectedPattern);
    }
  }

  async expectAnalyticsButtonsVisible(): Promise<void> {
    for (const testId of ANALYTICS_BUTTON_TESTIDS) {
      await expect(this.page.getByTestId(testId)).toBeVisible();
    }
  }

  async expectFiltersVisible(): Promise<void> {
    for (const testId of FILTER_TESTIDS) {
      await expect(this.page.getByTestId(testId)).toBeVisible();
    }
  }

  async expectNoSelectedItemsVisible(items: string[]): Promise<void> {
    await expect(this.cardsGrid).toBeVisible();
    for (const item of items) {
      await expect(this.cardsGrid).not.toContainText(
        new RegExp(String.raw`\b${item}\b`, 'i'),
      );
    }
  }

  async expectOnlySelectedAssetVisible(selectedAsset: string): Promise<void> {
    await this.page.waitForLoadState('load');
    await expect(this.cardsGrid).toBeVisible();

    await expect(
      this.page.getByTestId(`assets-${selectedAsset}`),
    ).not.toHaveCount(0);
  }

  async expectOnlySelectedTagVisible(selectedTag: string): Promise<void> {
    const allOptions = await this.getDropdownOptions('earn-filter-tag-select');
    const optionsToHide = allOptions.filter(
      (option) => option.toLowerCase() !== selectedTag.toLowerCase(),
    );

    const slug = (label: string): string =>
      label.toLowerCase().replace(/\s+/g, '-');

    for (const optionToHide of optionsToHide) {
      await expect(
        this.page.getByTestId(`earn-card-tag-${slug(optionToHide)}`),
      ).toHaveCount(0);
    }

    await expect(
      this.page.getByTestId(`earn-card-tag-${slug(selectedTag)}`),
    ).not.toHaveCount(0);
  }

  async getDropdownOptions(dropdownTestId: string): Promise<string[]> {
    // MUI Select renders options in a portal under <body>, not as descendants
    // of the trigger. Open the dropdown, read options at page scope, then close.
    await this.page.getByTestId(dropdownTestId).click();
    await expect(this.clearButton).toBeVisible();
    const options = await this.page.getByRole('option').allTextContents();
    await this.page.keyboard.press('Escape');
    return options;
  }

  async selectAllMarketsTab(): Promise<void> {
    await this.allMarketsTab.click();
  }

  async selectOptionFromDropdown(
    dropdownTestId: string,
    option: string,
  ): Promise<void> {
    await this.page.getByTestId(dropdownTestId).click();
    await expect(this.clearButton).toBeVisible();
    await this.page.getByRole('option', { name: option }).click();
    // eslint-disable-next-line playwright/no-wait-for-timeout -- settle for MUI dropdown re-render before body-click dismiss
    await this.page.waitForTimeout(1000);
    await this.page.locator('body').click();
  }

  async selectYourPositionsTab(): Promise<void> {
    await this.yourPositionsTab.click();
  }
}
