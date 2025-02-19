import { expect } from '@playwright/test';

export async function itemInSettingsMenu(page, selector: string) {
  await page
    .locator(`xpath=//p[normalize-space(text())="${selector}"]`)
    .click();
}

export async function itemInSettingsMenuToBeVisible(page, selector: string) {
  const itemName = await page.locator(
    `xpath=//button[normalize-space(text())="${selector}"]`,
  );
  expect(itemName).toBeVisible();
}
export async function itemInSettingsMenuToBeEnabled(page, selector: string) {
  const item = await page.locator(
    `xpath=//button[normalize-space(text())="${selector}"]`,
  );
  expect(item).toBeEnabled();
}