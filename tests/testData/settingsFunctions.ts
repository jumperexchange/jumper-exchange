import { expect } from '@playwright/test';

export async function itemInSettingsMenu(page, selector: string) {
  await page
    .getByText(selector, { exact: true })
    .click();
}

export async function checkItemInSettingsMenu(
  page,
  selector: string,
  options: { visible?: boolean; enabled?: boolean } = {},
) {
  const item = await page.locator(
    `xpath=//button[normalize-space(text())="${selector}"]`,
  );

  if (options.visible) {
    await expect(item).toBeVisible();
  }

  if (options.enabled) {
    await expect(item).toBeEnabled();
  }
}
