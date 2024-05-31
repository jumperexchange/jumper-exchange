import { XpIconContainer } from '@/components/ProfilePage/LevelBox/PointsBox.style';
import { useTheme } from '@mui/material';
import { XPIcon } from '../../illustrations/XPIcon';
import { CenteredBox, ProfilePageTypography } from '../ProfilePage.style';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const theme = useTheme();

  return (
    <CenteredBox>
      <ProfilePageTypography
        color={
          theme.palette.mode === 'light'
            ? theme.palette.accent1.main
            : theme.palette.white.main
        }
        sx={{
          fontSize: { xs: 48, sm: 80 },
        }}
      >
        {points ?? 0}
      </ProfilePageTypography>
      <XpIconContainer>
        <XPIcon />
      </XpIconContainer>
    </CenteredBox>
  );
};
