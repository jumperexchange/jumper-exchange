import { ProgressionBar } from './ProgressionBar';
import { TierBadgeBox, TierInfoBox, TierMainBox } from './TierBox.style';
import { PointsBox } from './PointsBox';
import { ProfilePageTypography } from '../ProfilePage.style';
import { Box } from '@mui/material';
import { levelsData } from './levelsData';
import { LevelData } from 'src/types';

function getLevelBasedOnPoints(points: number | undefined): LevelData {
  let levelData = levelsData[0];
  if (points) {
    for (const elem of levelsData) {
      if (points >= elem.minPoints && points <= elem.maxPoints) {
        levelData = elem;
        break;
      }
    }
  }
  return levelData;
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
