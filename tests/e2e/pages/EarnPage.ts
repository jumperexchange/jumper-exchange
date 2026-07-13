import { expect } from '@playwright/test';

import {
  missionsEarnPaths,
  parseSlugFromHref,
} from '../../performance/data/routePaths';
import { gotoAndWaitForLoad } from '../utils/navigationUtils';

import type { Locator, Page } from '@playwright/test';

const PAGE_READY_TIMEOUT_MS = 60_000;

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
  readonly clearFiltersButton: Locator;
  readonly forYouTab: Locator;
  readonly yourPositionsTab: Locator;

  constructor(private readonly page: Page) {
    this.allMarketsTab = page.getByTestId('earn-filter-tab-all');
    this.forYouTab = page.getByTestId('earn-filter-tab-foryou');
    this.yourPositionsTab = page.getByTestId('earn-filter-tab-your-positions');
    this.cardsGrid = page.getByTestId('earn-opportunities-cards-grid');
    // Dropdown-internal clear; only exists while a filter popover is open.
    this.clearButton = page.getByTestId('clear-button');
    // Filter-bar clear; renders at page level while any filter is applied.
    this.clearFiltersButton = page.getByTestId(
      'earn-filter-clear-filters-button',
    );
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
  }

  async discoverOpportunitySlugs(
    locale: string,
    limit: number,
  ): Promise<string[]> {
    await this.goto(locale);
    await this.expectAllMarketsListReady();

    const hrefs = await this.cardsGrid
      .locator('a[href*="/earn/"]')
      .evaluateAll((anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute('href'))
          .filter((href): href is string => !!href),
      );

    const slugs = [
      ...new Set(
        hrefs
          .map((href) => parseSlugFromHref(href, 'earn'))
          .filter((slug): slug is string => !!slug),
      ),
    ];

    return slugs.slice(0, limit);
  }

  async expectAllCardsHaveTag(selectedTag: string): Promise<void> {
    const slug = (label: string): string =>
      label.toLowerCase().replace(/\s+/g, '-');
    const cards = this.cardsGrid.getByTestId('earn-card');
    await expect(cards).not.toHaveCount(0);
    await expect(
      cards.filter({
        hasNot: this.page.getByTestId(`earn-card-tag-${slug(selectedTag)}`),
      }),
    ).toHaveCount(0);
  }

  async expectAllCardsShowChain(expectedChain: string): Promise<void> {
    await this.page.waitForLoadState('load');

    const chainNameElements = this.cardsGrid.getByTestId(
      'earn-card-chain-name',
    );
    await expect(chainNameElements).not.toHaveCount(0);

    const expectedPattern = new RegExp(`^${expectedChain}$`, 'i');
    await expect(
      chainNameElements.filter({ hasNotText: expectedPattern }),
    ).toHaveCount(0);
  }

  async expectAllMarketsListReady(): Promise<void> {
    await expect(this.allMarketsTab).toBeVisible({
      timeout: PAGE_READY_TIMEOUT_MS,
    });
    await this.selectAllMarketsTab();
    await expect(this.cardsGrid.first()).toBeVisible({
      timeout: PAGE_READY_TIMEOUT_MS,
    });
    await expect(
      this.cardsGrid.getByTestId('entity-stack-title').first(),
    ).toBeVisible({ timeout: PAGE_READY_TIMEOUT_MS });
  }

  async expectAnalyticsButtonsVisible(): Promise<void> {
    for (const testId of ANALYTICS_BUTTON_TESTIDS) {
      await expect(this.page.getByTestId(testId)).toBeVisible();
    }
  }

  async expectAtLeastOneCard(): Promise<void> {
    await expect(this.cardsGrid.getByTestId('earn-card')).not.toHaveCount(0);
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
      this.cardsGrid.getByTestId(`assets-${selectedAsset}`),
    ).not.toHaveCount(0);
    await expect(
      this.cardsGrid.locator(
        `[data-testid^="assets-"]:not([data-testid="assets-${selectedAsset}"])`,
      ),
    ).toHaveCount(0);
  }

  async getDropdownOptions(dropdownTestId: string): Promise<string[]> {
    // MUI Select renders options in a portal under <body>, not as descendants
    // of the trigger. Open the dropdown, read options at page scope, then close.
    await this.page.getByTestId(dropdownTestId).click();
    await this.clearButton.waitFor({ state: 'visible' });
    const options = await this.page.getByRole('option').allTextContents();
    await this.page.keyboard.press('Escape');
    return options;
  }

  async goto(locale: string): Promise<void> {
    await gotoAndWaitForLoad(this.page, missionsEarnPaths.earnIndex(locale));
  }

  async selectAllMarketsTab(): Promise<void> {
    await this.allMarketsTab.click();
  }

  async selectOptionFromDropdown(
    dropdownTestId: string,
    option: string,
  ): Promise<void> {
    await this.page.getByTestId(dropdownTestId).click();
    await this.clearButton.waitFor({ state: 'visible' });
    await this.page.getByRole('option', { name: option }).click();
    await this.page.keyboard.press('Escape');
  }

  async selectYourPositionsTab(): Promise<void> {
    await this.yourPositionsTab.click();
  }
}
