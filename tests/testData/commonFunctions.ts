import type { Locator, Page } from '@playwright/test';

export async function getElementByText(page: Page, text: string): Promise<Locator> {
  return page.locator(`xpath=//p[normalize-space(text())="${text}"]`);
}