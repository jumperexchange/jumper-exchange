import { SNOWFLAKE_COUNT, SNOWFLAKE_RANGES } from './constants';

export interface SnowflakeConfig {
  id: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayDuration: number;
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

export function generateSnowflakes(
  count: number = SNOWFLAKE_COUNT,
): SnowflakeConfig[] {
  const random = seededRandom(12345);

  return Array.from({ length: count }, (_, i) => ({
    id: `snowflake-${i}`,
    left: lerp(2, 98, random()),
    size: lerp(SNOWFLAKE_RANGES.size.min, SNOWFLAKE_RANGES.size.max, random()),
    duration: lerp(
      SNOWFLAKE_RANGES.duration.min,
      SNOWFLAKE_RANGES.duration.max,
      random(),
    ),
    delay: lerp(0, SNOWFLAKE_RANGES.delay.max, random()),
    swayDuration: lerp(
      SNOWFLAKE_RANGES.swayDuration.min,
      SNOWFLAKE_RANGES.swayDuration.max,
      random(),
    ),
  }));
}
