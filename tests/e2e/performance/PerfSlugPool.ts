import { EarnPage } from '../pages/EarnPage';
import { MissionsPage } from '../pages/MissionsPage';
import { pickRandomItem } from '../utils/perfRandom';

import type { PerfConfig } from '../data/perfConfig';
import type { Browser } from '@playwright/test';

export class PerfSlugPool {
  constructor(
    readonly missionSlugs: readonly string[],
    readonly earnSlugs: readonly string[],
  ) {}

  static async discover(
    browser: Browser,
    config: PerfConfig,
  ): Promise<PerfSlugPool> {
    const discoverMissionSlugs = async (): Promise<string[]> => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const slugs = await new MissionsPage(page).discoverSlugs(
        config.locale,
        config.slugPoolLimit,
      );
      await context.close();
      return slugs;
    };

    const discoverEarnSlugs = async (): Promise<string[]> => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const slugs = await new EarnPage(page).discoverOpportunitySlugs(
        config.locale,
        config.slugPoolLimit,
      );
      await context.close();
      return slugs;
    };

    // Separate pages: concurrent goto on one tab aborts the other (ERR_ABORTED).
    const [missionSlugs, earnSlugs] = await Promise.all([
      discoverMissionSlugs(),
      discoverEarnSlugs(),
    ]);

    return new PerfSlugPool(missionSlugs, earnSlugs);
  }

  pickEarnSlug(random: () => number): string {
    return pickRandomItem(this.earnSlugs, random);
  }

  pickMissionSlug(random: () => number): string {
    return pickRandomItem(this.missionSlugs, random);
  }
}
