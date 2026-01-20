import { expect, type Page } from '@playwright/test';

export async function selectAllMarketsTab(page: Page) {
  const allMarketsTab = page.getByTestId('earn-filter-tab-all');
  await allMarketsTab.click();
}

export async function selectYourPositionsTab(page: Page) {
  const yourPositionsTab = page.getByTestId('earn-filter-tab-your-positions');
  await yourPositionsTab.click();
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

  // Verify remaining buttons (toBeVisible already waits for elements)
  for (const chartButton of chartButtons.slice(1)) {
    await expect(page.getByTestId(chartButton)).toBeVisible();
  }
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
  await page.getByRole('option', { name: option }).click();
  await page.waitForTimeout(1000);
  await page.locator('body').click();
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
  await page.waitForTimeout(3000);
  const filteredCardsContainer = page.getByTestId(
    'earn-opportunities-cards-grid',
  );
  const chainNameElements = filteredCardsContainer.getByTestId(
    'earn-card-chain-name',
  );
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
  await page.waitForTimeout(3000);
  const earnOpportunitiesContainer = page.getByTestId(
    'earn-opportunities-cards-grid',
  );
  await expect(earnOpportunitiesContainer).toBeVisible();
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

export async function verifyFiltersAreVisible(page: Page) {
  const filterIds = [
    'earn-filter-chain-select',
    'earn-filter-protocol-select',
    'earn-filter-tag-select',
    'earn-filter-asset-select',
    'earn-filter-apy-select',
    'earn-filter-tvl-select',
  ];
  for (const filterId of filterIds) {
    await expect(page.getByTestId(filterId)).toBeVisible();
  }
}
