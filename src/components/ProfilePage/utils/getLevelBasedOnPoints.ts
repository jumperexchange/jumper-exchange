import { LevelData } from 'src/types/loyaltyPass';
import { levelsData } from '../constants';

export function getLevelBasedOnPoints(points: number | undefined): LevelData {
  if (points) {
    const levelData = levelsData.find(
      (el) => points >= el.minPoints && points <= el.maxPoints,
    );
    return levelData ?? levelsData[0];
  } else {
    return {
      level: 0,
      minPoints: levelsData[0].minPoints,
      maxPoints: levelsData[0].maxPoints,
    };
  }
}
