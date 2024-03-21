import { ProgressionBar } from './ProgressionBar';
import { TierBadgeBox, TierInfoBox, TierMainBox } from './TierBox.style';
import { PointsBox } from './PointsBox';
import { ProfilePageTypography } from '../ProfilePage.style';
import { Box } from '@mui/material';
import { levelsData } from './levelsData';
import type { LevelData } from 'src/types';
import { LevelBox } from './LevelBox';

function getLevelBasedOnPoints(points: number | undefined): LevelData {
  if (points) {
    const levelData = levelsData.find(
      (el) => points >= el.minPoints && points <= el.maxPoints,
    );
    return levelData ?? levelsData[0];
  }
  return levelsData[0];
}

interface TierBoxProps {
  tier?: string;
  points?: number;
  loading: boolean;
}

export const TierBox = ({ points, loading }: TierBoxProps) => {
  const levelData = getLevelBasedOnPoints(points);

  return (
    <TierMainBox>
      <Box sx={{ padding: '18px' }}>
        <TierInfoBox>
          <PointsBox points={points} />
          <LevelBox level={levelData.level} loading={loading} />
        </TierInfoBox>
        <ProgressionBar points={points} levelData={levelData} />
      </Box>
    </TierMainBox>
  );
};
