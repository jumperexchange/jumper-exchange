import { alpha } from '@mui/material';
import { Box, styled } from '@mui/system';

export const TierMainBox = styled(Box)(({ theme, style }) => ({
  height: '100%',
  width: '100%',
  borderRadius: '24px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  padding: '20px',
}));

export const TierBadgeBox = styled(Box)(({ theme, style }) => ({
  borderStyle: 'solid',
  borderWidth: 8,
  borderColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08),
  width: '168px',
  height: '80px',
  borderRadius: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...style,
}));

export const TierInfoBox = styled(Box)(() => ({
  marginTop: '24px',
  marginBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
}));
