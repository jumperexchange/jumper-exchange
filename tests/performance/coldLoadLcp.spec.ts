import { expect, noWalletTest as test } from '../e2e/fixtures/noWallet';
import { ColdLcpBenchmark } from './ColdLcpBenchmark';
import { loadPerfConfig } from './data/perfConfig';
import { PerfRouteFactory } from './PerfRouteFactory';
import { PerfSlugPool } from './PerfSlugPool';
import { createRandomSource } from './utils/perfRandom';

test.describe('@performance cold-load LCP', () => {
  test.describe.configure({ mode: 'serial' });

  const config = loadPerfConfig();
  let slugPool: PerfSlugPool;

  // Named setup test (not beforeAll) so Playwright attributes slug-discovery
  // failures to this step instead of the first `cold LCP: …` case.
  test('setup: discover slug pools (missions + earn)', async ({ browser }) => {
    slugPool = await PerfSlugPool.discover(browser, config);

    console.log(
      `[slug-pools] missions=${slugPool.missionSlugs.length} earn=${slugPool.earnSlugs.length} (limit ${config.slugPoolLimit})`,
    );

    expect(slugPool.missionSlugs.length).toBeGreaterThan(0);
    expect(slugPool.earnSlugs.length).toBeGreaterThan(0);
  });

  const indexRoutes = new PerfRouteFactory(config).buildIndexRoutes();

  for (const route of indexRoutes) {
    test(`cold LCP: ${route.name}`, async ({ browser }) => {
      const benchmark = new ColdLcpBenchmark(browser, config);

      expect(config.indexSamples).toBeGreaterThan(0);
      const summary = await benchmark.runSamples(
        route.name,
        config.indexSamples,
        () => route,
      );
      benchmark.assertSummary(summary, route.name, config.indexSamples);
    });
  }

  test('cold LCP: mission-detail (random slug)', async ({ browser }) => {
    const benchmark = new ColdLcpBenchmark(browser, config);
    const random = createRandomSource(config.randomSeed);
    const factory = new PerfRouteFactory(config, slugPool);

    expect(config.detailSamples).toBeGreaterThan(0);
    const summary = await benchmark.runSamples(
      'mission-detail-random',
      config.detailSamples,
      () => factory.randomMissionDetailRouteFromPool(random),
    );
    benchmark.assertSummary(
      summary,
      'mission-detail-random',
      config.detailSamples,
    );
  });

  test('cold LCP: earn-detail (random slug)', async ({ browser }) => {
    const benchmark = new ColdLcpBenchmark(browser, config);
    const random = createRandomSource(config.randomSeed);
    const factory = new PerfRouteFactory(config, slugPool);

    expect(config.detailSamples).toBeGreaterThan(0);
    const summary = await benchmark.runSamples(
      'earn-detail-random',
      config.detailSamples,
      () => factory.randomEarnDetailRouteFromPool(random),
    );
    benchmark.assertSummary(
      summary,
      'earn-detail-random',
      config.detailSamples,
    );
  });
});

test.describe('@performance missions to earn transition', () => {
  test.describe.configure({ mode: 'serial' });

  test('transition timing vs cold earn', async ({ browser }) => {
    const config = loadPerfConfig();
    const benchmark = new ColdLcpBenchmark(browser, config);

    const metrics = await benchmark.measureMissionsToEarnTransition();
    benchmark.logTransitionMetrics(metrics);

    expect(metrics.missionsReadyMs).toBeGreaterThan(0);
    expect(metrics.earnNavigationMs).toBeGreaterThan(0);
    expect(metrics.earnLcpMs).toBeGreaterThan(0);
  });
});
