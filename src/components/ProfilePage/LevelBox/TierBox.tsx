import type { LevelData } from '@/types/loyaltyPass';
import { Box } from '@mui/material';
import { LevelBox } from './LevelBox';
import { PointsBox } from './PointsBox';
import { ProgressionBar } from './ProgressionBar';
import { TierInfoBox, TierMainBox } from './TierBox.style';
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
      minPoints: 0,
      maxPoints: 0,
    };
  }
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
      <Box sx={{ padding: { xs: 1, sm: 2 } }}>
        <TierInfoBox>
          <PointsBox points={points} />
          <LevelBox level={levelData.level} loading={loading} />
        </TierInfoBox>
        <ProgressionBar points={points} levelData={levelData} />
      </Box>
    </TierMainBox>
  );
};
