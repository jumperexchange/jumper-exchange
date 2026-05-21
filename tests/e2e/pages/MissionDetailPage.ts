import { expect } from '@playwright/test';

import { missionsEarnPaths } from '../../performance/data/routePaths';
import { gotoAndWaitForLoad } from '../utils/navigationUtils';

import type { Page } from '@playwright/test';

const PAGE_READY_TIMEOUT_MS = 60_000;

export class MissionDetailPage {
  constructor(private readonly page: Page) {}

  async expectReady(): Promise<void> {
    await expect(this.page.locator('main')).toBeVisible({
      timeout: PAGE_READY_TIMEOUT_MS,
    });

    await expect(
      this.page
        .locator('main')
        .getByTestId(/^mission-card-/)
        .first(),
    ).toBeVisible({ timeout: PAGE_READY_TIMEOUT_MS });
  }

  async goto(locale: string, slug: string): Promise<void> {
    await gotoAndWaitForLoad(
      this.page,
      missionsEarnPaths.missionDetail(locale, slug),
    );
  }
}
