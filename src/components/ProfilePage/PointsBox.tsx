import { Box, Typography } from '@mui/material';
import { ProfilePageTypography } from './ProfilePage.style';
import { XPBox } from './xpBox';

interface PointsBoxProps {
  points?: number | null;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ProfilePageTypography
        fontSize={'80px'}
        lineHeight={'96px'}
        style={{ color: '#31007A' }}
      >
        {points ?? 0}
      </ProfilePageTypography>
      <Box sx={{ marginLeft: '16px' }}>
        <XPBox size={48} />
      </Box>
    </Box>
  );
};
