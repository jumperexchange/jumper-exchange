import { EarnDetailPage } from '../pages/EarnDetailPage';
import { EarnPage } from '../pages/EarnPage';
import { MissionDetailPage } from '../pages/MissionDetailPage';
import { MissionsPage } from '../pages/MissionsPage';

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
