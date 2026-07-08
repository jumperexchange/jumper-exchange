import { expect } from '@playwright/test';

import { gotoAndWaitForLoad } from '../e2e/utils/navigationUtils';
import { missionsEarnPaths } from './data/routePaths';
import { PerfPageCoordinator } from './PerfPageCoordinator';
import {
  installLcpObserver,
  type LcpSummary,
  readLcpMs,
  summarizeSamples,
} from './utils/measureLcp';

import type { PerfConfig } from './data/perfConfig';
import type { PerfRoute, TransitionMetrics } from './types';
import type { Browser } from '@playwright/test';

export class ColdLcpBenchmark {
  constructor(
    private readonly browser: Browser,
    private readonly config: PerfConfig,
  ) {}

  assertSummary(summary: LcpSummary, label: string, iterations: number): void {
    expect(summary.n).toBe(iterations);
    expect(summary.p50).toBeGreaterThan(0);

    const isEarnRoute = label.startsWith('earn');
    const isMissionRoute = label.startsWith('mission');
    const budgetMs = isEarnRoute
      ? this.config.earnP95BudgetMs
      : isMissionRoute
        ? this.config.missionsP95BudgetMs
        : this.config.p95BudgetMs;

    if (budgetMs == null) {
      return;
    }

    expect(
      summary.p95,
      `${label} LCP p95 should be <= ${budgetMs} ms`,
    ).toBeLessThanOrEqual(budgetMs);
  }

  logTransitionMetrics(metrics: TransitionMetrics): void {
    console.log(
      `[transition] summary (ms): ${JSON.stringify({
        earnLcpMs: Math.round(metrics.earnLcpMs),
        earnNavigationMs: metrics.earnNavigationMs,
        missionsReadyMs: metrics.missionsReadyMs,
        transitionDeltaMs: metrics.transitionDeltaMs,
      })}`,
    );
  }

  async measureMissionsToEarnTransition(): Promise<TransitionMetrics> {
    const { locale } = this.config;
    const context = await this.browser.newContext();

    try {
      const page = await context.newPage();
      const coordinator = new PerfPageCoordinator(page);

      await installLcpObserver(page);

      const missionsStart = Date.now();
      await gotoAndWaitForLoad(page, missionsEarnPaths.missionsIndex(locale));
      await coordinator.waitUntilReady('missions-index');
      const missionsReadyMs = Date.now() - missionsStart;

      const earnNavStart = Date.now();
      await gotoAndWaitForLoad(page, missionsEarnPaths.earnIndex(locale));
      await coordinator.waitUntilReady('earn-index');
      const earnNavigationMs = Date.now() - earnNavStart;
      const earnLcpMs = await readLcpMs(page);

      return {
        earnLcpMs,
        earnNavigationMs,
        missionsReadyMs,
        transitionDeltaMs: earnNavigationMs,
      };
    } finally {
      await context.close();
    }
  }

  async measureRoute(route: PerfRoute): Promise<number> {
    const context = await this.browser.newContext();

    try {
      const page = await context.newPage();

      await installLcpObserver(page);
      await gotoAndWaitForLoad(page, route.path);
      await new PerfPageCoordinator(page).waitUntilReady(route.kind);
      return await readLcpMs(page);
    } finally {
      await context.close();
    }
  }

  async runSamples(
    label: string,
    iterations: number,
    resolveRoute: () => PerfRoute,
  ): Promise<LcpSummary> {
    const samples: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const route = resolveRoute();
      const lcpMs = await this.measureRoute(route);
      samples.push(lcpMs);
      console.log(
        `[${label}] sample ${i + 1}/${iterations}: ${Math.round(lcpMs)} ms LCP (${route.path})`,
      );
    }

    const summary = summarizeSamples(samples);
    console.log(
      `[${label}] summary (ms): ${JSON.stringify({ [label]: summary })}`,
    );

    return summary;
  }
}
