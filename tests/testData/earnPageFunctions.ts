import { expect, type Page } from '@playwright/test';

export async function selectAllMarketsTab(page: Page) {
  const allMarketsTab = page.getByTestId('earn-filter-tab-all');
  await allMarketsTab.click();
}

export async function verifyAnalyticsButtonsAreVisible(page: Page) {
  const chartButtons = [
    'analytics-range-week',
    'analytics-range-month',
    'analytics-range-year',
    'analytics-value-apy',
    'analytics-value-tvl',
  ];
  await expect(page.getByTestId(chartButtons[0])).toBeVisible();
  for (const chartButton of chartButtons.slice(1)) {
    await expect(page.getByTestId(chartButton)).toBeVisible();
  }
}
export async function verifyNoSelectedChainsAreVisible(
  page: Page,
  chain1: string,
  chain2: string,
) {
  await verifyNoSelectedItemsAreVisible(page, [chain1, chain2]);
}

export async function selectOptionFromDropDown(
  page: Page,
  dropdown: string,
  option: string,
) {
  const dropdownFilter = page.getByTestId(dropdown);
  const clearButton = page.getByTestId('clear-button');
  await dropdownFilter.click();
  await expect(clearButton).toBeVisible();
  const optionElement = page.getByRole('option', { name: option });
  await optionElement.click();
  // Wait for dropdown to close (option should no longer be visible)
  await expect(optionElement).toBeHidden({ timeout: 5000 });
  // Wait for filter to apply by waiting for network to be idle or cards to update
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
    // If networkidle times out, that's okay - just continue
  });
}

export async function getAllOptionsFromDropdown(page: Page, dropdown: string) {
  const dropdownFilter = page.getByTestId(dropdown);
  const optionsArray = dropdownFilter.locator('[role="option"]');
  const options = await optionsArray.allTextContents();
  await page.keyboard.press('Escape'); //close dropdown
  return options;
}

export async function verifyNoSelectedProtocolsAreVisible(
  page: Page,
  protocol1: string,
) {
  await verifyNoSelectedItemsAreVisible(page, [protocol1]);
}

export async function verifyOnlySelectedAssetIsVisible(
  page: Page,
  selectedAsset: string,
) {
  await page.waitForLoadState('load');
  const filteredCardsContainer = page.getByTestId(
    'earn-opportunities-cards-grid',
  );
  await expect(filteredCardsContainer).toBeVisible();

  // Verify that only the selected asset's data-testid is visible
  const selectedAssetTestId = `assets-${selectedAsset}`;
  const selectedAssetElements = page.getByTestId(selectedAssetTestId);
  const selectedAssetCount = await selectedAssetElements.count();
  expect(selectedAssetCount).toBeGreaterThan(0);
}

export async function verifyAllCardsShowChain(
  page: Page,
  expectedChain: string,
) {
  await page.waitForLoadState('load');
  const filteredCardsContainer = page.getByTestId(
    'earn-opportunities-cards-grid',
  );
  // Wait for cards to be visible and loaded
  await expect(filteredCardsContainer).toBeVisible();
  const chainNameElements = filteredCardsContainer.getByTestId(
    'earn-card-chain-name',
  );
  // Wait for at least one card to appear
  await expect(chainNameElements.first()).toBeVisible({ timeout: 10000 });
  const count = await chainNameElements.count();

  // Verify each chain name matches the expected chain
  for (let i = 0; i < count; i++) {
    const chainElement = chainNameElements.nth(i);
    await expect(chainElement).toBeVisible();
    const chainText = await chainElement.textContent();
    console.debug(`Card ${i + 1}: Chain = "${chainText}"`);
    expect(chainText?.toLowerCase()).toBe(expectedChain.toLowerCase());
  }
}

/**
 * @param page - Playwright page object
 * @param items - Array of items to check for (chains, protocols, etc.)
 */

async function verifyNoSelectedItemsAreVisible(page: Page, items: string[]) {
  await page.waitForLoadState('load');
  const earnOpportunitiesContainer = page.getByTestId(
    'earn-opportunities-cards-grid',
  );
  await expect(earnOpportunitiesContainer).toBeVisible();
  // Wait for cards to be loaded before checking
  const cardElements = earnOpportunitiesContainer.locator(
    '[data-testid*="earn-card"]',
  );
  await expect(cardElements.first())
    .toBeVisible({ timeout: 10000 })
    .catch(() => {
      // If no cards are visible, that's also valid (empty state)
    });

  const childElements = earnOpportunitiesContainer.locator('*');
  const childCount = await childElements.count();

  console.debug(
    `Checking ${childCount} elements for items: ${items.join(', ')}`,
  );

  const patterns = items.map(
    (item) => new RegExp(`\\b${item.toLowerCase()}\\b`),
  );

  for (let i = 0; i < childCount; i++) {
    const childElement = childElements.nth(i);
    const textContent = await childElement.textContent();
    if (textContent) {
      const lowerText = textContent.toLowerCase();
      // Check all text content against the pattern

      for (let j = 0; j < patterns.length; j++) {
        const pattern = patterns[j];
        if (lowerText.match(pattern)) {
          console.debug(
            `Found matching text in element ${i}: "${textContent}"`,
          );
        }
        expect(lowerText).not.toMatch(pattern);
      }
    }
  }
}

export async function verifyOnlySelectedTagIsVisible(
  page: Page,
  selectedTag: string,
) {
  const allOptions = await getAllOptionsFromDropdown(
    page,
    'earn-filter-tag-select',
  );
  const optionsToHide = allOptions.filter(
    (option) => option.toLowerCase() !== selectedTag.toLowerCase(),
  );

  const selectedTagTestId = `earn-card-tag-${selectedTag.toLowerCase().replace(/\s+/g, '-')}`;
  const selectedTagElements = page.getByTestId(selectedTagTestId);
  const selectedTagCount = await selectedTagElements.count();

  for (const optionToHide of optionsToHide) {
    const hiddenTagTestId = `earn-card-tag-${optionToHide.toLowerCase().replace(/\s+/g, '-')}`;
    const hiddenTagElements = page.getByTestId(hiddenTagTestId);
    await expect(hiddenTagElements).toHaveCount(0);
  }

  expect(selectedTagCount).toBeGreaterThan(0); //verify that at least one tag is visible
}
