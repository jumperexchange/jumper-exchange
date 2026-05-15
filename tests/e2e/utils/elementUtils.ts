import type { Locator, Page } from '@playwright/test';

export async function isFullyInViewport(
  locator: Locator,
  page: Page,
): Promise<boolean> {
  const box = await locator.boundingBox();
  if (!box) {
    return false;
  }

  const viewport = page.viewportSize();
  if (!viewport) {
    return false;
  }

  const fitsHorizontally = box.x >= 0 && box.x + box.width <= viewport.width;
  const fitsVertically = box.y >= 0 && box.y + box.height <= viewport.height;

  return fitsHorizontally && fitsVertically;
}
