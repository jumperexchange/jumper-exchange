import { Locator, Page } from '@playwright/test';

/**
 * Checks if an element is fully visible within the viewport
 * @param locator The element to check
 * @param page The page containing the element
 * @returns true if the element is fully within the viewport, false otherwise
 */
export async function isFullyInViewport(locator: Locator, page: Page) {
  // Get the element's bounding box
  const box = await locator.boundingBox();
  if (!box) return false;

  // Get the viewport size
  const viewport = page.viewportSize();
  if (!viewport) return false;

  // Check if all corners of the element are within the viewport
  const isTopLeftInViewport = box.x >= 0 && box.y >= 0;
  const isTopRightInViewport =
    box.x + box.width <= viewport.width && box.y >= 0;
  const isBottomLeftInViewport =
    box.x >= 0 && box.y + box.height <= viewport.height;
  const isBottomRightInViewport =
    box.x + box.width <= viewport.width &&
    box.y + box.height <= viewport.height;

  // Element is fully in viewport if all corners are within bounds
  return (
    isTopLeftInViewport &&
    isTopRightInViewport &&
    isBottomLeftInViewport &&
    isBottomRightInViewport
  );
}
