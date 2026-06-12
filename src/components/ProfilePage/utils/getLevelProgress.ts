import type { LevelData } from '@/types/loyaltyPass';

/**
 * Fraction (0..1) of the way through the current level's XP range.
 */
export function getLevelProgress(
  points?: number,
  levelData?: LevelData,
): number {
  if (!levelData || !points) {
    return 0;
  }
  const range = levelData.maxPoints - levelData.minPoints;
  if (range <= 0) {
    return 0;
  }
  return Math.min(Math.max((points - levelData.minPoints) / range, 0), 1);
}
