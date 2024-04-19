import { Skeleton } from '@mui/material';
import { ProfilePageTypography } from '../ProfilePage.style';
import { TierBadgeBox } from './TierBox.style';

interface LevelBoxProps {
  level?: number;
  loading: boolean;
}

export const LevelBox = ({ level, loading }: LevelBoxProps) => {
  return (
    <TierBadgeBox>
      {loading ? (
        <Skeleton variant="text" sx={{ fontSize: '42px', width: '132px' }} />
      ) : (
        <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
          {`LEVEL ${level}`}
        </ProfilePageTypography>
      )}
    </TierBadgeBox>
  );
};
