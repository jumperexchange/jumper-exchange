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
        <Skeleton
          variant="text"
          sx={{ fontSize: { xs: 18, sm: 22 }, minWidth: 60 }}
        />
      ) : (
        <ProfilePageTypography fontSize={{ xs: 12, sm: 18 }}>
          {`LEVEL ${level}`}
        </ProfilePageTypography>
      )}
    </TierBadgeBox>
  );
};
