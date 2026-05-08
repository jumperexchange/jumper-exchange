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
    await expect(chainNameElements.first()).toBeVisible();
    const count = await chainNameElements.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const element = chainNameElements.nth(i);
      await expect(element).toBeVisible();
      const text = (await element.textContent()) ?? '';
      expect(text.toLowerCase()).toBe(expectedChain.toLowerCase());
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
    await this.page.waitForLoadState('load');
    await expect(this.cardsGrid).toBeVisible();

    const childElements = this.cardsGrid.locator('*');
    const childCount = await childElements.count();
    const patterns = items.map(
      (item) => new RegExp(`\\b${item.toLowerCase()}\\b`),
    );

    for (let i = 0; i < childCount; i++) {
      const text = (await childElements.nth(i).textContent()) ?? '';
      const lower = text.toLowerCase();
      for (const pattern of patterns) {
        expect(lower).not.toMatch(pattern);
      }
    }
  }

  async expectOnlySelectedAssetVisible(selectedAsset: string): Promise<void> {
    await this.page.waitForLoadState('load');
    await expect(this.cardsGrid).toBeVisible();

    const elements = this.page.getByTestId(`assets-${selectedAsset}`);
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);
  }

  async expectOnlySelectedTagVisible(selectedTag: string): Promise<void> {
    const allOptions = await this.getDropdownOptions('earn-filter-tag-select');
    const optionsToHide = allOptions.filter(
      (option) => option.toLowerCase() !== selectedTag.toLowerCase(),
    );

    const slug = (label: string): string =>
      label.toLowerCase().replace(/\s+/g, '-');

    const selectedTagCount = await this.page
      .getByTestId(`earn-card-tag-${slug(selectedTag)}`)
      .count();

    for (const optionToHide of optionsToHide) {
      await expect(
        this.page.getByTestId(`earn-card-tag-${slug(optionToHide)}`),
      ).toHaveCount(0);
    }

    expect(selectedTagCount).toBeGreaterThan(0);
  }

  async getDropdownOptions(dropdownTestId: string): Promise<string[]> {
    const options = await this.page
      .getByTestId(dropdownTestId)
      .locator('[role="option"]')
      .allTextContents();
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
    // MUI dropdown re-renders cards after selection; brief settle-wait before
    // the body-click dismiss avoids racing the menu close animation.
    // eslint-disable-next-line playwright/no-wait-for-timeout -- intentional UI settle
    await this.page.waitForTimeout(1000);
    await this.page.locator('body').click();
  }

  async selectYourPositionsTab(): Promise<void> {
    await this.yourPositionsTab.click();
  }
}
