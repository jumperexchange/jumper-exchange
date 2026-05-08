import { qase } from 'playwright-qase-reporter';

import { CHAINS } from './data';
import { expect, connectedTest as test } from './fixtures';
import { EarnPage } from './pages';

import type { Page } from '@playwright/test';

// Shared `beforeEach` body for the four describe blocks that start on the
// All-Markets tab. The Analytics and Your-Positions blocks have different
// setup (different path / different tab) and use their own `beforeEach`.
async function setupAllMarketsView(jumperPage: Page): Promise<void> {
  await jumperPage.goto('/earn');
  await jumperPage.waitForLoadState('load');
  await new EarnPage(jumperPage).selectAllMarketsTab();
}

test.describe('Chains filters on Earn page', () => {
  test.beforeEach(async ({ jumperPage }) => setupAllMarketsView(jumperPage));

  test(
    qase(40, 'Should be able to navigate to the earn page'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);

      await test.step('Navigate to earn page and verify URL', async () => {
        await expect(jumperPage).toHaveURL(/\/earn/);
      });

      await test.step('Verify Earn tabs are visible', async () => {
        await expect(earnPage.allMarketsTab).toBeVisible();
        await expect(
          jumperPage.getByTestId('earn-filter-tab-foryou'),
        ).toBeVisible();
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

  test(
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

  test(
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

  test(
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

  test(
    qase(51, 'Should be able to filter by Synthetic tag'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-tag-select',
        'Synthetic',
      );
      await earnPage.expectOnlySelectedTagVisible('Synthetic');
    },
  );

  test(
    qase(46, 'Should be able to filter by Yield Aggregator tag'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-tag-select',
        'Yield Aggregator',
      );
      await earnPage.expectOnlySelectedTagVisible('Yield Aggregator');
    },
  );

  test(
    qase(48, 'Should be able to filter by Liquid Staking tag'),
    async ({ jumperPage }) => {
      const earnPage = new EarnPage(jumperPage);
      await earnPage.selectOptionFromDropdown(
        'earn-filter-tag-select',
        'Liquid Staking',
      );
      await earnPage.expectOnlySelectedTagVisible('Liquid Staking');
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

  test(
    qase(56, 'Should be able to navigate to the "Your Positions" tab'),
    async ({ jumperPage }) => {
      await new EarnPage(jumperPage).expectFiltersVisible();
    },
  );
});
