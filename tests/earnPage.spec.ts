import { expect, test } from "@playwright/test";
import {
	verifyNoSelectedChainsAreVisible,
	selectChain,
	selectProtocol,
	verifyNoSelectedProtocolsAreVisible,
} from "./testData/earnPageFunctions";

test.describe("Chains filters on Earn page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/earn");
		const allMarketsTab = page.getByTestId("_r_4_-all");
		await allMarketsTab.click();
	});

	test("Should be able to navigate to the earn page", async ({ page }) => {
		await test.step("Navigate to earn page and verify URL", async () => {
			await expect(page).toHaveURL("/earn");
		});

		await test.step("Verify Earn tabs are visible", async () => {
			const allMarketsTab = page.getByTestId("_r_4_-all");
			const forYouTab = page.getByTestId("_r_4_-foryou");
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
	test("Should be able to filter by base chain", async ({ page }) => {
		await test.step("Select base chain", async () => {
			await selectChain(page, "base");
		});

		await test.step("Verify no arbitrum or mainnet items after selecting base chain", async () => {
			await verifyNoSelectedChainsAreVisible(page, "arbitrum", "mainnet");
		});
	});

	test("Should be able to filter by arbitrum chain", async ({ page }) => {
		await test.step("Select arbitrum chain", async () => {
			await selectChain(page, "arbitrum");
		});

		await test.step("Verify no base or mainnet items after selecting arbitrum chain", async () => {
			await verifyNoSelectedChainsAreVisible(page, "base", "mainnet");
		});
	});

	test("Should be able to filter by mainnet chain", async ({ page }) => {
		await test.step("Select mainnet chain", async () => {
			await selectChain(page, "mainnet");
		});

		await test.step("Verify no arbitrum or base items after selecting mainnet chain", async () => {
			await verifyNoSelectedChainsAreVisible(page, "arbitrum", "base");
		});
	});
});

test.describe.skip("Protocols filters on Earn page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/earn");
		const allMarketsTab = page.getByTestId("_r_4_-all");
		await allMarketsTab.click();
	});

	test("Should be able to filter by Aave protocol", async ({ page }) => {
		await test.step("Select Aave protocol", async () => {
			await selectProtocol(page, "aave");
		});

		await test.step("Verify no morpho protocol is visible after selecting aave protocol", async () => {
			await verifyNoSelectedProtocolsAreVisible(page,"morpho");
		});
	});

	test("Should be able to filter by morpho protocol", async ({ page }) => {
		await test.step("Select morpho protocol", async () => {
			await selectProtocol(page, "morpho");
		});

		await test.step("Verify no aave protocol is visible after selecting morpho protocol", async () => {
			await verifyNoSelectedProtocolsAreVisible(page, "aave");
		});
	});

	});

