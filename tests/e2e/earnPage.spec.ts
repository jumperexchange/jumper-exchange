import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

import { CHAINS } from './data';
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

  // Blocked: filter chip bar (`earn-filter-chain-select` et al) doesn't render reliably on cold-start.
  // Re-enable once the cold-start tab-switch race is fixed or filter-bar testids stabilize. JUM-924-adjacent.
  test.fixme(
    qase(40, 'Should be able to navigate to the earn page'),
    async ({ jumperPage }) => {
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

      await test.step('Validate filters on Your Positions tab', async () => {
        await earnPage.selectYourPositionsTab();
        await earnPage.expectFiltersVisible();
      });
    },
  );

  // JUM-924 item #8: `earn-card-chain-name` testid removed from loaded EarnCards.
  // Re-enable when the FE adds a chain-name testid to loaded (non-skeleton) cards.
  test.fixme(
    qase(41, 'Should be able to filter by base chain'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-chain-select',
        'Base',
      );
      await earnPage.expectAllCardsShowChain('Base');
    },
  );

  // JUM-924 item #8: same as qase 41 — chain-name testid gap.
  test.fixme(
    qase(42, 'Should be able to filter by arbitrum chain'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-chain-select',
        'arbitrum',
      );
      await earnPage.expectAllCardsShowChain('Arbitrum');
    },
  );

  // JUM-924 item #8: same as qase 41 — chain-name testid gap.
  test.fixme(
    qase(43, 'Should be able to filter by ethereum chain'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-chain-select',
        'ethereum',
      );
      await earnPage.expectAllCardsShowChain(CHAINS.ETHEREUM);
    },
  );
});

test.describe('Protocols filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test(
    qase(39, 'Should be able to filter by Aave protocol'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-protocol-select',
        'aave',
      );
      await earnPage.expectNoSelectedItemsVisible(['morpho']);
    },
  );

  test(
    qase(38, 'Should be able to filter by morpho protocol'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-protocol-select',
        'morpho',
      );
      await earnPage.expectNoSelectedItemsVisible(['aave']);
    },
  );
});

test.describe('Assets filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test(
    qase(44, 'Should be able to filter by EURC asset'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-asset-select',
        'EURC',
      );
      await earnPage.expectOnlySelectedAssetVisible('EURC');
    },
  );
});

test.describe('Tags filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  // JUM-924 item #13: card-level `earn-card` testid needed for per-card scoping.
  test.fixme(
    qase(208, 'Filter by tag returns only cards that have that tag'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      const baseline = await earnPage.getCardCount();

      for (const tag of ['Yield Aggregator', 'Liquid Staking', 'Synthetic']) {
        await earnPage.selectOptionFromDropdown('earn-filter-tag-select', tag);
        await earnPage.expectCardCountLessThan(baseline);
        await earnPage.expectAtLeastOneCard();
        await earnPage.expectAllCardsHaveTag(tag);
        await earnPage.clearFilters();
      }
    },
  );
});

test.describe('Analytics filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await jumperPage.goto('/earn/hyperbeat-ultra-hype-on-hyperliquid');
    await jumperPage.waitForLoadState('domcontentloaded');
    await jumperPage.waitForLoadState('load');
  });

  test(
    qase(47, 'Should be able to verify analytics buttons are visible'),
    async ({ jumperPage }) => {
      await new EarnPage(jumperPage).expectAnalyticsButtonsVisible();
    },
  );
});

test.describe('Should be able to navigate to the "Your Positions" tab', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await jumperPage.goto('/earn');
    await jumperPage.waitForLoadState('load');
    await new EarnPage(jumperPage).selectYourPositionsTab();
  });

  // Blocked: filter chip bar doesn't render on Your Positions tab with an empty wallet
  // (same FE behavior surfaced by qase 40). Re-enable with funded wallet or filter-bar testid fix.
  test.fixme(
    qase(56, 'Should be able to navigate to the "Your Positions" tab'),
    async ({ jumperPage }) => {
      await new EarnPage(jumperPage).expectFiltersVisible();
    },
  );
});
