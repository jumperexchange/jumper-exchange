import { useTheme } from '@mui/material';
import { CenteredBox, ProfilePageTypography } from './ProfilePage.style';
import { XPIcon } from '../illustrations/XPIcon';

interface PointsBoxProps {
  points?: number | null;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const theme = useTheme();

  return (
    <CenteredBox>
      <ProfilePageTypography
        fontSize={'80px'}
        lineHeight={'96px'}
        style={{
          color: theme.palette.mode === 'light' ? '#31007A' : '#BEA0EB',
        }}
      >
        {points ?? 0}
      </ProfilePageTypography>
      <XPIcon size={48} marginLeft={'16px'} />
    </CenteredBox>
  );
};
