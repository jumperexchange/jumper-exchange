import { Box } from '@mui/material';
import { alpha, darken, lighten, styled } from '@mui/material/styles';

const MessageCard = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  whiteSpace: 'pre-line',
  margin: 'auto',
}));

export const WarningMessageCard = styled(MessageCard)(({ theme }) => ({
  width: 392,
  borderRadius: '12px',
  padding: theme.spacing(2, 3),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.warning.main, 0.24)
      : alpha(theme.palette.warning.main, 0.16),
}));

export const WarningMessageCardTitle = styled(Box)(({ theme }) => ({
  padding: 0,
  color:
    theme.palette.mode === 'light'
      ? darken(theme.palette.warning.main, 0.36)
      : alpha(theme.palette.warning.dark, 1),
}));

export const InfoMessageCard = styled(MessageCard)(({ theme }) => ({
  padding: 0,
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.info.main, 0.12)
      : alpha(theme.palette.info.main, 0.16),
}));

export const InfoMessageCardTitle = styled(Box)(({ theme }) => ({
  padding: 0,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.info.main
      : lighten(theme.palette.info.main, 0.24),
}));
