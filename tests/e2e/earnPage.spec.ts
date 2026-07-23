import { expect } from '@playwright/test';

import { CHAINS } from './data/urls';
import { connectedTest as test } from './fixtures/connectedWallet';
import { EarnPage } from './pages/EarnPage';

import type { Page } from '@playwright/test';

// Shared beforeEach for the four All-Markets describe blocks. Analytics + Your-Positions have their own.
async function setupAllMarketsView(jumperPage: Page): Promise<void> {
  await jumperPage.goto('/earn');
  await jumperPage.waitForLoadState('load');
  await new EarnPage(jumperPage).selectAllMarketsTab();
}

test.describe('Chains filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test('Should be able to navigate to the earn page', async ({
    jumperPage,
  }) => {
    const earnPage = new EarnPage(jumperPage);

    await test.step('Navigate to earn page and verify URL', async () => {
      await expect(jumperPage).toHaveURL(/\/earn/);
    });

    await test.step('Verify Earn tabs are visible', async () => {
      await expect(earnPage.allMarketsTab).toBeVisible();
      await expect(earnPage.forYouTab).toBeVisible();
      await expect(earnPage.yourPositionsTab).toBeVisible();
    });

    await test.step('Validate filters on All Markets tab', async () => {
      await earnPage.expectFiltersVisible();
    });
  });

  test('Should be able to filter by base chain', async ({ jumperPage }) => {
    const earnPage = new EarnPage(jumperPage);
    await earnPage.selectOptionFromDropdown('earn-filter-chain-select', 'Base');
    await earnPage.expectAllCardsShowChain('Base');
  });

  test('Should be able to filter by arbitrum chain', async ({ jumperPage }) => {
    const earnPage = new EarnPage(jumperPage);
    await earnPage.selectOptionFromDropdown(
      'earn-filter-chain-select',
      'arbitrum',
    );
    await earnPage.expectAllCardsShowChain('Arbitrum');
  });

  test('Should be able to filter by ethereum chain', async ({ jumperPage }) => {
    const earnPage = new EarnPage(jumperPage);
    await earnPage.selectOptionFromDropdown(
      'earn-filter-chain-select',
      'ethereum',
    );
    await earnPage.expectAllCardsShowChain(CHAINS.ETHEREUM);
  });
});

test.describe('Protocols filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test('Should be able to filter by Aave protocol', async ({ jumperPage }) => {
    const earnPage = new EarnPage(jumperPage);
    await earnPage.selectOptionFromDropdown(
      'earn-filter-protocol-select',
      'aave',
    );
    await earnPage.expectNoSelectedItemsVisible(['morpho']);
  });

  test('Should be able to filter by morpho protocol', async ({
    jumperPage,
  }) => {
    const earnPage = new EarnPage(jumperPage);
    await earnPage.selectOptionFromDropdown(
      'earn-filter-protocol-select',
      'morpho',
    );
    await earnPage.expectNoSelectedItemsVisible(['aave']);
  });
});

test.describe('Assets filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test('Should be able to filter by EURC asset', async ({ jumperPage }) => {
    const earnPage = new EarnPage(jumperPage);
    await earnPage.selectOptionFromDropdown('earn-filter-asset-select', 'EURC');
    await earnPage.expectOnlySelectedAssetVisible('EURC');
  });
});

test.describe('Tags filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test('Filter by tag returns only cards that have that tag', async ({
    jumperPage,
  }) => {
    test.slow();
    const earnPage = new EarnPage(jumperPage);

    // The grid caps at a page size, so count deltas can't detect filtering.
    for (const tag of ['Yield Aggregator', 'Liquid Staking', 'Synthetic']) {
      await earnPage.selectOptionFromDropdown('earn-filter-tag-select', tag);
      await earnPage.expectAtLeastOneCard();
      await earnPage.expectAllCardsHaveTag(tag);
      await earnPage.clearFilters();
    }
  });
});

test.describe('Analytics filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await jumperPage.goto('/earn/hyperbeat-ultra-hype-on-hyperliquid');
    await jumperPage.waitForLoadState('domcontentloaded');
    await jumperPage.waitForLoadState('load');
  });

  test('Should be able to verify analytics buttons are visible', async ({
    jumperPage,
  }) => {
    await new EarnPage(jumperPage).expectAnalyticsButtonsVisible();
  });
});

test.describe('Should be able to navigate to the "Your Positions" tab', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await jumperPage.goto('/earn');
    await jumperPage.waitForLoadState('load');
    await new EarnPage(jumperPage).selectYourPositionsTab();
  });

  // Blocked on funded QA wallet — an empty wallet's Your Positions tab renders
  // no filter selects (nothing to filter), so this needs positions to assert on.
  test.fixme('Should be able to navigate to the "Your Positions" tab', async ({
    jumperPage,
  }) => {
    await new EarnPage(jumperPage).expectFiltersVisible();
  });
});
