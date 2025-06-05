import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export async function clickItemInSettingsMenu(page: Page, selector: string) {
  await page
    .getByText(selector, { exact: true })
    .click();
}

export async function checkItemInSettingsMenu(
  page: Page,
  selector: string,
  options: { visible?: boolean; invisible?: boolean; enabled?: boolean } = {},
) {
  await checkElement(page, selector, 'button', options);
}

export async function checkSettingInSettingsMenu(
  page: Page, 
  selector: string, 
  options: { visible?: boolean; invisible?: boolean; enabled?: boolean } = {}) {
  await checkElement(page, selector, 'p', options);
}

/**
 * Helper function that checks if an element exists and verifies its properties   
 * 
 * This function takes a page object and looks for an element matching the given
 * text content and element type. It can verify if the element is visible and/or
 * enabled based on the provided options.
 * 
 * @param page The Playwright page object
 * @param selector The exact text content of the item to check
 * @param elementType The type of HTML element to check (e.g. 'button', 'p')
 * @param options Object containing visibility and enabled state options
 * @param options.visible If true, verifies the element is visible
 * @param options.enabled If true, verifies the element is enabled
 */
async function checkElement(page: Page, selector: string, elementType: string, options: { visible?: boolean; invisible?: boolean; enabled?: boolean } = {}) {
  const item = await page.locator(
    `xpath=//${elementType}[normalize-space(text())="${selector}"]`,
  );

  if (options.visible) {
    await expect(item).toBeVisible();
  }

  if (options.enabled) {
    await expect(item).toBeEnabled();
  }

  if (options.invisible) {
    await expect(item).not.toBeVisible();
  }
}

/**
 * Helper function that extracts the numerator and denominator from a combined numerator/denominator string
 * 
 * @param locator The locator object for the combined numerator/denominator string
 * @returns An object with numerator and denominator values
 * @throws Error if the fraction format is invalid
 */
async function getNumeratorDenominator(locator: Locator): Promise<{ numerator: number; denominator: number }> {
  const combinedText = await locator.textContent() ?? '';
  const [numeratorString, denominatorString] = combinedText.split('/');
  
  if (!numeratorString || !denominatorString) {
    throw new Error(`Invalid fraction format: ${combinedText}`);
  }

  const numerator = Number(numeratorString);
  const denominator = Number(denominatorString);

  if (denominator === 0) {
    throw new Error('Denominator cannot be 0');
  }
  
  return { numerator, denominator };
}

/**
 * Gets the fraction locator for a specific category
 * 
 * @param page The Playwright page object
 * @param category The category name (e.g. 'Bridges' or 'Exchanges')
 * @returns The locator for the fraction element
 */
function getFractionLocator(page: Page, category: string): Locator {
  return page.getByText(category)
    .locator('..')
    .locator('..')
    .locator('xpath=//*[contains(text(), "/")]');
}

/**
 * Verifies that the numerator and denominator are equal for a given category
 * 
 * @param page The Playwright page object
 * @param category The category name to check (e.g. 'Bridges' or 'Exchanges')
 */
export async function checkFractionsEqual(page: Page, category: string): Promise<void> {
  await checkDeselectedAmount(page, category, 0);
}

/**
 * Verifies that the numerator is less than the denominator for a given category by the deselected amount
 * 
 * @param page The Playwright page object
 * @param category The category name to check (e.g. 'Bridges' or 'Exchanges')
 * @param deselectedAmount The amount the numerator is less than the denominator
 */
export async function checkDeselectedAmount(page: Page, category: string, deselectedAmount: number): Promise<void> {
  const fractionLocator = getFractionLocator(page, category);
  const { numerator, denominator } = await getNumeratorDenominator(fractionLocator);
  await expect(numerator).toBe(denominator - deselectedAmount);
}

/**
 * Verifies that the numerator is 0 for a given category
 * 
 * @param page The Playwright page object
 * @param category The category name to check (e.g. 'Bridges' or 'Exchanges')
 */
export async function checkNoneSelected(page: Page, category: string): Promise<void> {
  const fractionLocator = getFractionLocator(page, category);
  const { numerator, denominator } = await getNumeratorDenominator(fractionLocator);
  await expect(numerator).toBe(0);
}