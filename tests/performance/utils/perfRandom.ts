export const parsePositiveInt = (
  raw: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(raw ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
};

/** Deterministic RNG for reproducible perf runs (Mulberry32). */
export const createSeededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const createRandomSource = (seed?: number): (() => number) => {
  if (seed != null && Number.isFinite(seed)) {
    return createSeededRandom(seed);
  }
  return Math.random;
};

export const pickRandomItem = <T>(
  items: readonly T[],
  random: () => number,
): T => {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty pool');
  }
  const index = Math.floor(random() * items.length);
  return items[index] ?? items[0];
};
