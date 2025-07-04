import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ZapTabsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderRadius: '24px',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  boxShadow:
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  ...theme.applyStyles('light', {
    boxShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  }),
}));
