import { alpha, Box, Breakpoint, styled, IconButton } from '@mui/material';

export const TxConfirmationMainBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: '16px',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  gap: '8px',
  backgroundColor: theme.palette.surface2.main,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
}));

export const FlexRowCenterGapBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
}));

export const RoundedColoredBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.surface1.main,
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));
