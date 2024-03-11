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
  padding: '10px',
}));

export const TierBadgeBox = styled(Box)(({ theme, style }) => ({
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08),
  width: '168px',
  height: '72px',
  borderRadius: '48px',
  display: 'flex',

  justifyContent: 'center',
  alignItems: 'center',
  ...style,
}));

export const TierInfoBox = styled(Box)(() => ({
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));
