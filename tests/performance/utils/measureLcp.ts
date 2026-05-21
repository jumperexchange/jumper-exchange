import { expect, type Page } from '@playwright/test';

export const LCP_POLL_TIMEOUT_MS = 15_000;

export interface LcpSummary {
  max: number;
  min: number;
  n: number;
  p50: number;
  p75: number;
  p95: number;
}

export const installLcpObserver = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    (window as Window & { __perfLcpMs?: number }).__perfLcpMs = undefined;

    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          (window as Window & { __perfLcpMs?: number }).__perfLcpMs =
            last.startTime;
        }
      }).observe({ buffered: true, type: 'largest-contentful-paint' });
    } catch {
      // LCP not supported in this environment
    }
  });
};

export const readLcpMs = async (page: Page): Promise<number> => {
  let lcpMs = 0;

  await expect
    .poll(
      async () => {
        lcpMs =
          (await page.evaluate(() => {
            const fromObserver = (window as Window & { __perfLcpMs?: number })
              .__perfLcpMs;
            if (typeof fromObserver === 'number' && fromObserver > 0) {
              return fromObserver;
            }

            const entries = performance.getEntriesByType(
              'largest-contentful-paint',
            );
            const last = entries[entries.length - 1];
            if (last && last.startTime > 0) {
              return last.startTime;
            }

            return null;
          })) ?? 0;
        return lcpMs;
      },
      { timeout: LCP_POLL_TIMEOUT_MS },
    )
    .toBeGreaterThan(0);

  return lcpMs;
};

const percentile = (sorted: number[], p: number): number => {
  if (sorted.length === 0) {
    return 0;
  }

  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)] ?? 0;
};

export const summarizeSamples = (samples: number[]): LcpSummary => {
  const sorted = [...samples].sort((a, b) => a - b);

  return {
    max: Math.round(sorted[sorted.length - 1] ?? 0),
    min: Math.round(sorted[0] ?? 0),
    n: sorted.length,
    p50: Math.round(percentile(sorted, 50)),
    p75: Math.round(percentile(sorted, 75)),
    p95: Math.round(percentile(sorted, 95)),
  };
};
