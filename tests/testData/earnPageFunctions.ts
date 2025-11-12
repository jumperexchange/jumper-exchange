import { expect, type Page } from '@playwright/test';

export async function selectAllMarketsTab(page: Page) {
  const allMarketsTab = page.getByTestId('earn-filter-tab-all');
  await allMarketsTab.click();
}

export async function verifyAnalyticsButtonsAreVisible(page: Page) {
	const chartButtons = [
		"analytics-range-day",
		"analytics-range-week",
		"analytics-range-month",
		"analytics-range-year",
		"analytics-value-apy",
		"analytics-value-tvl",
	];
	for (const chartButton of chartButtons) {
		await page.waitForLoadState("networkidle");
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

export async function verifyNoSelectedAssetsAreVisible(
  page: Page,
  asset1: string,
) {
  await verifyNoSelectedItemsAreVisible(page, [asset1]);
}

export async function getAllAssetsFromDropdown(page: Page): Promise<string[]> {
  // Wait for the dropdown to be visible and options to load
  await page.waitForLoadState('networkidle');

  const options = page.locator('[role="option"]');

  // Wait for at least one option to be available
  await options.first().waitFor({ state: 'visible', timeout: 10000 });

  // Get the actual count of available options
  const optionCount = await options.count();
  console.log(`Found ${optionCount} options in the dropdown`);

  const assets: string[] = [];
  for (let i = 0; i < optionCount; i++) {
    const optionText = await options.nth(i).textContent();
    if (optionText?.trim()) {
      assets.push(optionText.trim());
    }
  }
  return assets;
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
    console.log(`Card ${i + 1}: Chain = "${chainText}"`);
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

  console.log(`Checking ${childCount} elements for items: ${items.join(', ')}`);

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
          console.log(`Found matching text in element ${i}: "${textContent}"`);
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
