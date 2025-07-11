import type { Locator, Page } from '@playwright/test';

export async function getElementByText(
  page: Page,
  text: string,
): Promise<Locator> {
  return page.locator(`xpath=//p[normalize-space(text())="${text}"]`);
}

export async function triggerButtonClick(
  page: Page,
  buttonText: string,
): Promise<void> {
  await page.getByRole('button', { name: buttonText }).click();
}
