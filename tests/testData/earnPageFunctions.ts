import { expect, type Page } from "@playwright/test";

export async function selectAllMarketsTab(page: Page) {
	const allMarketsTab = page.locator(
		'xpath=//button[normalize-space(text())="All Markets"]',
	);
	await allMarketsTab.click();
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
	await dropdownFilter.click();
	await page.waitForLoadState("networkidle");
	await page.getByRole("option", { name: option }).waitFor({ state: "visible", timeout: 10000 });
	await page.getByRole("option", { name: option }).click();
	await page.waitForTimeout(1000);
	await page.locator("body").click();
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

/**
 * Gets all available assets from the asset dropdown
 * @param page - Playwright page object
 * @returns Array of asset names
 */
export async function getAllAssetsFromDropdown(page: Page): Promise<string[]> {
	// Wait for the dropdown to be visible and options to load
	await page.waitForLoadState("networkidle");
	
	const options = page.locator('[role="option"]');
	
	// Wait for at least one option to be available
	await options.first().waitFor({ state: "visible", timeout: 10000 });
	
	// Get the actual count of available options
	const optionCount = await options.count();
	console.log(`Found ${optionCount} options in the dropdown`);

	const assets: string[] = [];
	for (let i = 0; i < optionCount; i++) {
		try {
			// Wait for the specific option to be available before getting its text
			await options.nth(i).waitFor({ state: "visible", timeout: 5000 });
			const optionText = await options.nth(i).textContent();
			if (optionText?.trim()) {
				assets.push(optionText.trim());
			}
		} catch (error) {
			console.log(`Failed to get text for option ${i}: ${error?.toString()}`);
			// Continue with the next option instead of failing the entire test
			continue;
		}
	}
	
	// Close the dropdown
	await page.keyboard.press("Escape");

	return assets;
}

/**
 * Verifies that when a specific asset is selected, all other assets are not visible
 * @param page - Playwright page object
 * @param selectedAsset - The asset that should be visible
 */
export async function verifyOnlySelectedAssetIsVisible(
	page: Page,
	selectedAsset: string,
) {
	// Open the asset dropdown to get all available options
	const assetDropdown = page.getByTestId("earn-filter-asset-select");
	await assetDropdown.click();
	
	// Wait for the dropdown to open
	await page.waitForLoadState("networkidle");
	
	const allAssets = await getAllAssetsFromDropdown(page);
	const assetsToHide = allAssets.filter(
		(asset) => asset.toLowerCase() !== selectedAsset.toLowerCase(),
	);
	await verifyNoSelectedItemsAreVisible(page, assetsToHide);
}

/**
 * Verifies that all earn cards display the expected chain name
 * @param page - Playwright page object
 * @param expectedChain - The chain name that should be displayed (e.g., "Base", "Mainnet", "Arbitrum")
 */
export async function verifyAllCardsShowChain(
	page: Page,
	expectedChain: string,
) {
	await page.waitForLoadState("load");
	await page.waitForTimeout(3000);

	// Get the filtered cards container and then find chain name elements within it
	const filteredCardsContainer = page.getByTestId("earn-filtered-cards-container");
	const chainNameElements = filteredCardsContainer.getByTestId("earn-card-chain-name");
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
	await page.waitForLoadState("load");
	await page.waitForTimeout(3000);
	const earnOpportunitiesContainer = page.locator(
		'xpath=(//div[@class="MuiBox-root mui-1iwh6v5"]//div)[1]',
	);
	await expect(earnOpportunitiesContainer).toBeVisible();
	const childElements = earnOpportunitiesContainer.locator("*");
	const childCount = await childElements.count();

	console.log(`Checking ${childCount} elements for items: ${items.join(", ")}`);

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
