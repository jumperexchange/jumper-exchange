import { Box, Typography, useTheme } from '@mui/material';
import { ProfilePageTypography } from './ProfilePage.style';
import { XPBox } from './xpBox';

interface PointsBoxProps {
  points?: number | null;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ProfilePageTypography
        fontSize={'80px'}
        lineHeight={'96px'}
        style={{
          color: theme.palette.mode === 'light' ? '#31007A' : '#BEA0EB',
        }}
      >
        {points ?? 0}
      </ProfilePageTypography>
      <Box sx={{ marginLeft: '16px' }}>
        <XPBox size={48} />
      </Box>
    </Box>
  );
};
