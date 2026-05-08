import PlaywrightWrapper from './PlaywrightWrapper';

import type { Page } from '@playwright/test';

/**
 * Factory responsible for providing a single PlaywrightWrapper
 * instance per Playwright Page.
 */
export default class PlaywrightFactory {
  /** private, page-keyed cache */
  private static readonly cache: WeakMap<Page, PlaywrightWrapper> =
    new WeakMap();

  /**
   * Drop the wrapper for a page – useful in unit tests
   */
  static clear(page: Page): void {
    this.cache.delete(page);
  }

  /**
   * Return the cached wrapper for a Playwright `page`,
   * or create / cache / return a fresh one the first time.
   */
  static getWrapper(page: Page): PlaywrightWrapper {
    const existing = this.cache.get(page);
    if (existing) {
      return existing;
    }
    const created = new PlaywrightWrapper(page);
    this.cache.set(page, created);
    return created;
  }
}
