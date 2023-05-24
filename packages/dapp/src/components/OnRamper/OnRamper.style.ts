import { styled } from '@mui/material';

export const OnRamperIFrame = styled('iframe')(({ theme }) => ({
  borderRadius: '12px',
  border: 'unset',
  margin: `0 auto`,
  maxWidth: '392px',
  height: '560px',
  minWidth: '375px',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  '& .oui-currency-card-root': {},
  // todo: style iframe´s hover-effects on menu + more
}));
