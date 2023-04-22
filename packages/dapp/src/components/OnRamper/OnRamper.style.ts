import { styled } from '@mui/material';

export const OnRamperIFrame = styled('iframe')(({ theme }) => ({
  borderRadius: '12px',
  border: 'unset',
  backgroundColor: theme.palette.surface1.main,
  margin: `${theme.spacing(4)} auto`,
  maxWidth: '392px',
  minWidth: '375px',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  '& .oui-currency-card-root': {
    border: '1px solid orange',
  },
}));
