import { styled } from '@mui/material';

export const OnRamperIFrame = styled('iframe')(({ theme }) => ({
  borderRadius: '12px',
  border: 'unset',
  margin: `0 auto 24px auto`,
  maxWidth: '392px',
  height: '630px',
  minWidth: '375px',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
}));
