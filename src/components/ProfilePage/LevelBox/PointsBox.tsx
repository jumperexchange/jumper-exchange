import { useTheme } from '@mui/material';
import { CenteredBox, ProfilePageTypography } from '../ProfilePage.style';
import { XPIcon } from '../../illustrations/XPIcon';
import { XpIconContainer } from '@/components/ProfilePage/LevelBox/PointsBox.style';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const theme = useTheme();

  return (
    <CenteredBox>
      <ProfilePageTypography
        sx={{
          fontSize: { xs: 48, sm: 80 },
          color:
            theme.palette.mode === 'light'
              ? theme.palette.pink.light
              : theme.palette.pink.dark,
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
