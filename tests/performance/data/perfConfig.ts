import { parsePositiveInt } from '../utils/perfRandom';

export interface PerfConfig {
  detailSamples: number;
  fixedEarnSlug?: string;
  fixedMissionSlug?: string;
  indexSamples: number;
  locale: string;
  p95BudgetMs?: number;
  randomSeed?: number;
  slugPoolLimit: number;
}

export const loadPerfConfig = (): PerfConfig => {
  const indexSamples = parsePositiveInt(process.env.PERF_SAMPLES, 10);
  const p95BudgetRaw = process.env.PERF_P95_BUDGET_MS;
  const p95BudgetMs =
    p95BudgetRaw != null && Number.isFinite(Number(p95BudgetRaw))
      ? Number(p95BudgetRaw)
      : undefined;

  const seedRaw = process.env.PERF_RANDOM_SEED;
  const randomSeed =
    seedRaw != null && seedRaw.length > 0 && Number.isFinite(Number(seedRaw))
      ? Number(seedRaw)
      : undefined;

  return {
    detailSamples: parsePositiveInt(
      process.env.PERF_DETAIL_SAMPLES,
      indexSamples,
    ),
    fixedEarnSlug: process.env.PERF_EARN_SLUG,
    fixedMissionSlug: process.env.PERF_MISSION_SLUG,
    indexSamples,
    locale: process.env.PERF_LOCALE ?? 'en',
    p95BudgetMs,
    randomSeed,
    slugPoolLimit: parsePositiveInt(process.env.PERF_DISCOVER_SLUG_LIMIT, 50),
  };
};
