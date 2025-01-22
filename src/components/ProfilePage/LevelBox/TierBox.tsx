'use client';

import type { LevelData } from '@/types/loyaltyPass';
import { CardContainer } from '../ProfilePage.style';
import { LevelBox } from './LevelBox';
import { PointsBox } from './PointsBox';
import { ProgressionBar } from './ProgressionBar';
import { TierInfoBox } from './TierBox.style';
import { levelsData } from './levelsData';

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

interface TierBoxProps {
  points?: number;
  loading: boolean;
}

export const TierBox = ({ points, loading }: TierBoxProps) => {
  const levelData = getLevelBasedOnPoints(points);

  return (
    <CardContainer>
      <TierInfoBox>
        <PointsBox points={points} />
        <LevelBox level={levelData.level} loading={loading} />
      </TierInfoBox>
      <ProgressionBar
        ongoingValue={points}
        levelData={levelData}
        loading={loading}
      />
    </CardContainer>
  );
};
