import { expect, test } from '@playwright/test';
import {
  verifyNoSelectedProtocolsAreVisible,
  selectAllMarketsTab,
  selectOptionFromDropDown,
  verifyOnlySelectedAssetIsVisible,
  verifyAllCardsShowChain,
  verifyOnlySelectedTagIsVisible,
  verifyAnalyticsButtonsAreVisible,
} from './testData/earnPageFunctions';
import { qase } from 'playwright-qase-reporter';
import { injectMockWallet } from './utils/mockWallet';
import {
  connectButton,
  expectSelectWalletOptionToBeVisible,
  selectWalletOption,
} from './testData/connectWalletFunctions';

test.describe('Chains filters on Earn page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/earn');
    await connectButton(page).click();
    await expectSelectWalletOptionToBeVisible(page);
    await selectWalletOption(page, 'MetaMask');
    await selectAllMarketsTab(page);
  });

  test(
    qase(40, 'Should be able to navigate to the earn page'),
    async ({ page }) => {
      await test.step('Navigate to earn page and verify URL', async () => {
        await expect(page.url()).toContain('/earn');
      });

      await test.step('Verify Earn tabs are visible', async () => {
        const allMarketsTab = page.getByTestId('earn-filter-tab-all');
        const forYouTab = page.getByTestId('earn-filter-tab-foryou');
        const tabs = [allMarketsTab, forYouTab];
        for (const tab of tabs) {
          await expect(tab).toBeVisible();
        }
      });

      await test.step('Validate if filters are visible on All Markets tab', async () => {
        const filterIds = [
          'earn-filter-chain-select',
          'earn-filter-protocol-select',
          'earn-filter-tag-select',
          'earn-filter-asset-select',
          'earn-filter-apy-select',
        ];
        for (const filterId of filterIds) {
          await expect(page.getByTestId(filterId)).toBeVisible();
        }
      });
    },
  );
  test(qase(41, 'Should be able to filter by base chain'), async ({ page }) => {
    await test.step('Select base chain', async () => {
      await selectOptionFromDropDown(page, 'earn-filter-chain-select', 'base');
    });

    await test.step('Verify all cards show Base chain name', async () => {
      await verifyAllCardsShowChain(page, 'Base');
    });
  });

  test(
    qase(42, 'Should be able to filter by arbitrum chain'),
    async ({ page }) => {
      await test.step('Select arbitrum chain', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-chain-select',
          'arbitrum',
        );
      });

      await test.step('Verify all cards show Arbitrum chain name', async () => {
        await verifyAllCardsShowChain(page, 'Arbitrum');
      });
    },
  );

  test(
    qase(43, 'Should be able to filter by ethereum chain'),
    async ({ page }) => {
      await test.step('Select ethereum chain', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-chain-select',
          'ethereum',
        );
      });

      await test.step('Verify all cards show Ethereum chain name', async () => {
        await verifyAllCardsShowChain(page, 'Ethereum');
      });
    },
  );
});

test.describe('Protocols filters on Earn page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/earn');
    await connectButton(page).click();
    await expectSelectWalletOptionToBeVisible(page);
    await selectWalletOption(page, 'MetaMask');
    await selectAllMarketsTab(page);
  });

  test(
    qase(39, 'Should be able to filter by Aave protocol'),
    async ({ page }) => {
      await test.step('Select Aave protocol', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-protocol-select',
          'aave',
        );
      });

      await test.step('Verify no morpho protocol is visible after selecting aave protocol', async () => {
        await verifyNoSelectedProtocolsAreVisible(page, 'morpho');
      });
    },
  );

  test(
    qase(38, 'Should be able to filter by morpho protocol'),
    async ({ page }) => {
      await test.step('Select morpho protocol', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-protocol-select',
          'morpho',
        );
      });

      await test.step('Verify no aave protocol is visible after selecting morpho protocol', async () => {
        await verifyNoSelectedProtocolsAreVisible(page, 'aave');
      });
    },
  );
});

test.describe('Assets filters on Earn page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/earn');
    await connectButton(page).click();
    await expectSelectWalletOptionToBeVisible(page);
    await selectWalletOption(page, 'MetaMask');
    await selectAllMarketsTab(page);
  });

  test(qase(44, 'Should be able to filter by EURC asset'), async ({ page }) => {
    await test.step('Select EURC asset', async () => {
      await selectOptionFromDropDown(page, 'earn-filter-asset-select', 'EURC');
    });

    await test.step('Verify only EURC asset is visible', async () => {
      await verifyOnlySelectedAssetIsVisible(page, 'EURC');
    });
  });
});
test.describe('Tags filters on Earn page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/earn');
    await connectButton(page).click();
    await expectSelectWalletOptionToBeVisible(page);
    await selectWalletOption(page, 'MetaMask');
    await selectAllMarketsTab(page);
  });

  test(
    qase(45, 'Should be able to filter by Synthetic tag'),
    async ({ page }) => {
      await test.step('Select Synthetic tag', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-tag-select',
          'Synthetic',
        );
      });

      await test.step('Verify only Synthetic tag is visible', async () => {
        await verifyOnlySelectedTagIsVisible(page, 'Synthetic');
      });
    },
  );

  test(
    qase(46, 'Should be able to filter by Yield Aggregator tag'),
    async ({ page }) => {
      await test.step('Select Yield Aggregator tag', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-tag-select',
          'Yield Aggregator',
        );
      });

      await test.step('Verify only Yield Aggregator tag is visible', async () => {
        await verifyOnlySelectedTagIsVisible(page, 'Yield Aggregator');
      });
    },
  );
  test(
    qase(48, 'Should be able to filter by Liquid Staking tag'),
    async ({ page }) => {
      await test.step('Select Liquid Staking tag', async () => {
        await selectOptionFromDropDown(
          page,
          'earn-filter-tag-select',
          'Liquid Staking',
        );
      });

      await test.step('Verify only Liquid Staking tag is visible', async () => {
        await verifyOnlySelectedTagIsVisible(page, 'Liquid Staking');
      });
    },
  );
});

test.describe('Analytics filters on Earn page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/earn/hyperbeat-ultra-hype-on-hyperliquid');
  });

  test(
    qase(47, 'Should be able to verify analytics buttons are visible'),
    async ({ page }) => {
      await test.step('Verify analytics range filters are visible', async () => {
        await verifyAnalyticsButtonsAreVisible(page);
      });
    },
  );
});
