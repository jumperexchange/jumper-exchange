import { missionsEarnPaths } from './data/routePaths';

import type { PerfConfig } from './data/perfConfig';
import type { PerfSlugPool } from './PerfSlugPool';
import type { PerfRoute } from './types';

export class PerfRouteFactory {
  constructor(
    private readonly config: PerfConfig,
    private readonly slugPool?: PerfSlugPool,
  ) {}

  buildIndexRoutes(): PerfRoute[] {
    const { locale } = this.config;
    const routes: PerfRoute[] = [
      {
        kind: 'missions-index',
        name: 'missions-index',
        path: missionsEarnPaths.missionsIndex(locale),
      },
      {
        kind: 'earn-index',
        name: 'earn-index',
        path: missionsEarnPaths.earnIndex(locale),
      },
    ];

    if (this.config.fixedMissionSlug) {
      routes.push(this.missionDetailRoute(this.config.fixedMissionSlug));
    }

    if (this.config.fixedEarnSlug) {
      routes.push(this.earnDetailRoute(this.config.fixedEarnSlug));
    }

    return routes;
  }

  randomEarnDetailRoute(slug: string): PerfRoute {
    return this.earnDetailRoute(slug);
  }

  randomEarnDetailRouteFromPool(random: () => number): PerfRoute {
    if (!this.slugPool) {
      throw new Error('Slug pool is required for random earn detail routes');
    }
    return this.randomEarnDetailRoute(this.slugPool.pickEarnSlug(random));
  }

  randomMissionDetailRoute(slug: string): PerfRoute {
    return this.missionDetailRoute(slug);
  }

  randomMissionDetailRouteFromPool(random: () => number): PerfRoute {
    if (!this.slugPool) {
      throw new Error('Slug pool is required for random mission detail routes');
    }
    return this.randomMissionDetailRoute(this.slugPool.pickMissionSlug(random));
  }

  private earnDetailRoute(slug: string): PerfRoute {
    return {
      kind: 'earn-detail',
      name: `earn-detail-${slug}`,
      path: missionsEarnPaths.earnDetail(this.config.locale, slug),
    };
  }

  private missionDetailRoute(slug: string): PerfRoute {
    return {
      kind: 'mission-detail',
      name: `mission-detail-${slug}`,
      path: missionsEarnPaths.missionDetail(this.config.locale, slug),
    };
  }
}
