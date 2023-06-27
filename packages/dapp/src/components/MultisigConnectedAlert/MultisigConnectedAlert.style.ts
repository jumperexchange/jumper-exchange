import { styled } from '@mui/material/styles';
import { Box, Breakpoint, Button, alpha } from '@mui/material';
import { InfoRounded } from '@mui/icons-material';

export const MultisigConnectedAlertContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '64px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '392px',
  [theme.breakpoints.up('sm' as Breakpoint)]: { top: '72px' },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(6),
  borderRadius: '16px',
  background:
    theme.palette.mode === 'dark'
      ? theme.palette.surface2.main
      : theme.palette.surface1.main,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
}));

export const MultisigConnectedAlertButton = styled(Button)(({ theme }) => ({
  width: '100%',
  borderRadius: '24px',
  fontWeight: 700,
  padding: theme.spacing(2.5, 0),
}));

export const MultisigConnectedAlertIconContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.12),
  borderRadius: '100%',
  height: '96px',
  width: '96px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '24px',
}));

export const MultisigConnectedAlertIcon = styled(InfoRounded)(({ theme }) => ({
  margin: '24px',
  height: '48px',
  width: '48px',
  color: theme.palette.info.main,
  zIndex: 2,
}));
