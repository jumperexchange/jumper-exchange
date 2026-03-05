'use client';

import { CardContainer } from '../LeaderboardCard/LeaderboardCard.style';
import { LevelBox } from './LevelBox';
import { PointsBox } from './PointsBox';
import { ProgressionBar } from './ProgressionBar';
import { TierInfoBox } from './TierBox.style';
import { getLevelBasedOnPoints } from '../utils/getLevelBasedOnPoints';

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
