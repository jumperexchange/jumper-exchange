import { expect } from '@playwright/test';

import {
  missionsEarnPaths,
  parseSlugFromHref,
} from '../../performance/data/routePaths';
import { gotoAndWaitForLoad } from '../utils/navigationUtils';

import type { Page } from '@playwright/test';

const PAGE_READY_TIMEOUT_MS = 60_000;

export class MissionsPage {
  constructor(private readonly page: Page) {}

  async discoverSlugs(locale: string, limit: number): Promise<string[]> {
    await this.goto(locale);
    await this.expectListReady();

    const hrefs = await this.page
      .locator('a[href*="/missions/"]')
      .evaluateAll((anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute('href'))
          .filter((href): href is string => !!href),
      );

    const slugs = [
      ...new Set(
        hrefs
          .map((href) => parseSlugFromHref(href, 'missions'))
          .filter((slug): slug is string => !!slug),
      ),
    ];

    return slugs.slice(0, limit);
  }

  async expectListReady(): Promise<void> {
    await expect(this.page.getByTestId(/^mission-card-/).first()).toBeVisible({
      timeout: PAGE_READY_TIMEOUT_MS,
    });
  }

  async goto(locale: string): Promise<void> {
    await gotoAndWaitForLoad(
      this.page,
      missionsEarnPaths.missionsIndex(locale),
    );
  }
}
