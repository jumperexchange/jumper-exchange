import { useTheme } from '@mui/material';
import { CenteredBox, ProfilePageTypography } from '../ProfilePage.style';
import { XPIcon } from '../../illustrations/XPIcon';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const theme = useTheme();

  return (
    <CenteredBox>
      <ProfilePageTypography
        fontSize={'80px'}
        lineHeight={'96px'}
        sx={{
          color:
            theme.palette.mode === 'light'
              ? theme.palette.pink.light
              : theme.palette.white.main,
        }}
      >
        {points ?? 0}
      </ProfilePageTypography>
      <CenteredBox sx={{ marginLeft: '16px' }}>
        <XPIcon size={48} />
      </CenteredBox>
    </CenteredBox>
  );
};
