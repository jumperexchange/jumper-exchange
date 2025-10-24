import { expect, test } from "@playwright/test";
import {
	verifyNoSelectedProtocolsAreVisible,
	selectAllMarketsTab,
	selectOptionFromDropDown,
	verifyOnlySelectedAssetIsVisible,
	verifyAllCardsShowChain,
} from "./testData/earnPageFunctions";
import { qase } from 'playwright-qase-reporter';

test.describe("Chains filters on Earn page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/earn");
		await selectAllMarketsTab(page);
	});

	test(qase(40, 'Should be able to navigate to the earn page'), async ({ page }) => {
		await test.step("Navigate to earn page and verify URL", async () => {
			await expect(page.url()).toContain("/earn");
		});

		await test.step("Verify Earn tabs are visible", async () => {
			const allMarketsTab = page.locator('xpath=//button[normalize-space(text())="All Markets"]');
			const forYouTab = page.locator('xpath=//button[normalize-space(text())="For You"]');
			const tabs = [allMarketsTab, forYouTab];
			for (const tab of tabs) {
				await expect(tab).toBeVisible();
			}
		});

		await test.step("Validate if filters are visible on All Markets tab", async () => {
			const filterIds = [
				"earn-filter-chain-select",
				"earn-filter-protocol-select",
				"earn-filter-tag-select",
				"earn-filter-asset-select",
				"earn-filter-apy-select",
			];
			for (const filterId of filterIds) {
				await expect(page.getByTestId(filterId)).toBeVisible();
			}
		});
	});
	test(qase(41, 'Should be able to filter by base chain'), async ({ page }) => {
		await test.step("Select base chain", async () => {
			await selectOptionFromDropDown(page, "earn-filter-chain-select", "base");
		});
		
		await test.step("Verify all cards show Base chain name", async () => {
			await verifyAllCardsShowChain(page, "Base");
		});
	});

	test(qase(42,'Should be able to filter by arbitrum chain'), async ({ page }) => {
		await test.step("Select arbitrum chain", async () => {
			await selectOptionFromDropDown(page, "earn-filter-chain-select", "arbitrum");
		});
		
		await test.step("Verify all cards show Arbitrum chain name", async () => {
			await verifyAllCardsShowChain(page, "Arbitrum");
		});
	});

	test(qase(43,'Should be able to filter by mainnet chain'), async ({ page }) => {
		await test.step("Select mainnet chain", async () => {
			await selectOptionFromDropDown(page, "earn-filter-chain-select", "mainnet");
		});
		
		await test.step("Verify all cards show Mainnet chain name", async () => {
			await verifyAllCardsShowChain(page, "Mainnet");
		});
	});
});

test.describe("Protocols filters on Earn page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/earn");
		await selectAllMarketsTab(page);
	});

	test(qase(39,'Should be able to filter by Aave protocol'), async ({ page }) => {
		await test.step("Select Aave protocol", async () => {
			await selectOptionFromDropDown(page, "earn-filter-protocol-select", "aave");
		});

		await test.step("Verify no morpho protocol is visible after selecting aave protocol", async () => {
			await verifyNoSelectedProtocolsAreVisible(page, "morpho");
		});
	});

	test(qase(38, 'Should be able to filter by morpho protocol'), async ({ page }) => {
		await test.step("Select morpho protocol", async () => {
			await selectOptionFromDropDown(page, "earn-filter-protocol-select", "morpho");
		});

		await test.step("Verify no aave protocol is visible after selecting morpho protocol", async () => {
			await verifyNoSelectedProtocolsAreVisible(page, "aave");
		});
	});

	});

	test.describe("Assets filters on Earn page", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("/earn");
			await selectAllMarketsTab(page);
		});
		
		test(qase(44,'Should be able to filter by ETHx asset'), async ({ page }) => {
			await test.step("Select ETHx asset", async () => {
				await selectOptionFromDropDown(page, "earn-filter-asset-select", "ETHx");
			});

			await test.step("Verify only ETHx assets are visible (all other assets hidden)", async () => {
				await verifyOnlySelectedAssetIsVisible(page, "ETHx");
			});
		});
		
	});

