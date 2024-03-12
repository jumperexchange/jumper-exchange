import { ProgressionBar } from './ProgressionBar';
import { TierBadgeBox, TierInfoBox, TierMainBox } from './TierBox.style';
import { PointsBox } from './PointsBox';
import { ProfilePageTypography } from './ProfilePage.style';
import { Box } from '@mui/material';
import { levelsData } from './levelsData';

interface TierBoxProps {
  tier?: string | null;
  points?: number | null;
}

export const TierBox = ({ points }: TierBoxProps) => {
  let levelData = levelsData[0];
  if (points) {
    for (const elem of levelsData) {
      if (points >= elem.minPoints && points <= elem.maxPoints) {
        levelData = elem;
        break;
      }
    }
  }

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
