import { expect, Locator, Page } from '@playwright/test';

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
 * This function takes a locator object and returns an object with the numerator and denominator values.
 * The combined numerator/denominator string is expected to be in the format "numerator/denominator".
 * 
 * @param locator The locator object for the combined numerator/denominator string
 * @returns An object with numerator and denominator values
 */
export async function getNumeratorDenominator(locator: Locator): Promise<{ numerator: string; denominator: string }> {
  const combinedNumeratorDenominator = await locator.textContent() ?? '';
  const numerator = combinedNumeratorDenominator.split('/')[0];
  const denominator = combinedNumeratorDenominator.split('/')[1];
  return { numerator, denominator };
}

/**
 * Helper function that checks if the numerator and denominator are equal for a given category
 * 
 * This function takes a page object and a category name (e.g. 'Bridges' or 'Exchanges')
 * and verifies that the numerator and denominator values are equal.
 * 
 * @param page The Playwright page object
 * @param category The category name to check (e.g. 'Bridges' or 'Exchanges')
 */
export async function checkFractionsEqual(page: Page, category: string) {
  const fractionLocator = page.getByText(category)
    .locator('..')
    .locator('..')
    .locator('xpath=//*[contains(text(), "/")]');
  const fractions = await getNumeratorDenominator(fractionLocator);
  await expect(fractions.numerator).toEqual(fractions.denominator);
}
