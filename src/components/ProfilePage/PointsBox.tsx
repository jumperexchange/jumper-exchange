import { Box, Typography } from '@mui/material';
import { ProfilePageTypography } from './ProfilePage.style';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <ProfilePageTypography fontSize={'64px'} lineHeight={'72px'}>
        {points ?? 0}
      </ProfilePageTypography>
      <ProfilePageTypography
        fontSize={'14px'}
        lineHeight={'20px'}
        fontWeight={400}
        style={{
          color: '#858585',
          marginLeft: '8px',
          marginBottom: '8px',
        }}
      >
        {'points'}
      </ProfilePageTypography>
    </Box>
  );
};
