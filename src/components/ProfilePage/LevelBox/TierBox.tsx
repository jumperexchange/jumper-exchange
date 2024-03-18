import { ProgressionBar } from './ProgressionBar';
import { TierBadgeBox, TierInfoBox, TierMainBox } from './TierBox.style';
import { PointsBox } from './PointsBox';
import { ProfilePageTypography } from '../ProfilePage.style';
import { Box } from '@mui/material';
import { levelsData } from './levelsData';
import type { LevelData } from 'src/types';

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
}

export const TierBox = ({ points }: TierBoxProps) => {
  const levelData = getLevelBasedOnPoints(points);

  return (
    <TierMainBox>
      <Box sx={{ padding: '18px' }}>
        <TierInfoBox>
          <PointsBox points={points} />
          <TierBadgeBox>
            <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
              {`LEVEL ${levelData.level}`}
            </ProfilePageTypography>
          </TierBadgeBox>
        </TierInfoBox>
        <ProgressionBar points={points} levelData={levelData} />
      </Box>
    </TierMainBox>
  );
};
