import { describe, expect, it, vi } from 'vitest';
import { getPathBasedIntegrator } from './getPathBasedIntegrator';

const EARN_INTEGRATOR = 'jumper-earn';
const DEFAULT_INTEGRATOR = 'jumper';

const TEST_CONFIG = {
  NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN: EARN_INTEGRATOR,
  NEXT_PUBLIC_WIDGET_INTEGRATOR: DEFAULT_INTEGRATOR,
};

describe('getPathBasedIntegrator', () => {
  const earnRelatedPaths = [
    ['/earn', 'direct earn path'],
    ['/portfolio', 'direct portfolio path'],
    ['/fr/earn', 'fr locale + earn'],
    ['/fr/earn/midas-basis-trading-token-on-base', 'fr locale + earn subpath'],
    ['/it/earn', 'it locale + earn'],
    ['/it/portfolio', 'it locale + portfolio'],
    ['/it/earn/some-vault', 'it locale + earn subpath'],
    ['/es/portfolio/details', 'es locale + portfolio subpath'],
    ['/zh/earn', 'zh locale + earn'],
  ] as const;

  const nonEarnPaths = [
    ['/fr?fromChain=1&toChain=21000000', 'fr locale root with query'],
    ['/it', 'it locale root'],
    ['/es/', 'es locale root with trailing slash'],
    ['/fr/missions/some-missing-with-earn', 'missions path (earn in slug)'],
    ['/fr/missions/earn-trick', 'fr locale + earn trick'],
    ['/missions/portfolio/test', 'portfolio as deep subpath'],
    ['/missions/earn-trick', 'earn trick'],
    ['/it/missions/portfolio-project', 'missions path (portfolio in slug)'],
    ['/missions/hello/earn', 'earn as deep subpath'],
    ['/', 'root path'],
    ['/swap', 'swap path'],
    ['/it/bridge', 'it locale + bridge'],
    ['/zh/gas', 'zh locale + gas'],
    [null, 'null value'],
    [undefined, 'undefined value'],
  ] as const;

  it.each(earnRelatedPaths)(
    'should return earn integrator for %s (%s)',
    (pathname) => {
      expect(getPathBasedIntegrator(pathname, TEST_CONFIG)).toBe(
        EARN_INTEGRATOR,
      );
    },
  );

  it.each(nonEarnPaths)(
    'should return default integrator for %s (%s)',
    (pathname) => {
      expect(getPathBasedIntegrator(pathname, TEST_CONFIG)).toBe(
        DEFAULT_INTEGRATOR,
      );
    },
  );
});
