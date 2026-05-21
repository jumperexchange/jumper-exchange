import { EarnDetailPage } from '../e2e/pages/EarnDetailPage';
import { EarnPage } from '../e2e/pages/EarnPage';
import { MissionDetailPage } from '../e2e/pages/MissionDetailPage';
import { MissionsPage } from '../e2e/pages/MissionsPage';

import type { PerfRouteKind } from './types';
import type { Page } from '@playwright/test';

/** Waits until a route’s LCP-relevant content is visible (POM delegation). */
export class PerfPageCoordinator {
  constructor(private readonly page: Page) {}

  async waitUntilReady(kind: PerfRouteKind): Promise<void> {
    switch (kind) {
      case 'earn-detail':
        await new EarnDetailPage(this.page).expectReady();
        break;
      case 'earn-index':
        await new EarnPage(this.page).expectAllMarketsListReady();
        break;
      case 'mission-detail':
        await new MissionDetailPage(this.page).expectReady();
        break;
      case 'missions-index':
        await new MissionsPage(this.page).expectListReady();
        break;
    }
  }
}
