import { expect } from '@playwright/test';

import { missionsEarnPaths } from '../../performance/data/routePaths';
import { gotoAndWaitForLoad } from '../utils/navigationUtils';

import type { Locator, Page } from '@playwright/test';

const PAGE_READY_TIMEOUT_MS = 60_000;

export class EarnDetailPage {
  readonly protocolCard: Locator;

  constructor(private readonly page: Page) {
    this.protocolCard = page.locator('main').getByTestId('protocol-card');
  }

  async expectReady(): Promise<void> {
    await expect(this.protocolCard).toBeVisible({
      timeout: PAGE_READY_TIMEOUT_MS,
    });
  }

  async goto(locale: string, slug: string): Promise<void> {
    await gotoAndWaitForLoad(
      this.page,
      missionsEarnPaths.earnDetail(locale, slug),
    );
  }
}
