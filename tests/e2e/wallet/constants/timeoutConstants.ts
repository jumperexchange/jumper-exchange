function parseTimeout(value: string | undefined, fallbackMs: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
}

export const DEFAULT_TIMEOUT: number = parseTimeout(
  process.env.DEFAULT_TIMEOUT,
  3000,
);
export const LONG_TIMEOUT: number = parseTimeout(
  process.env.LONG_TIMEOUT,
  7000,
);
export const API_TIMEOUT_DEFAULT: number = parseTimeout(
  process.env.API_TIMEOUT,
  5000,
);
