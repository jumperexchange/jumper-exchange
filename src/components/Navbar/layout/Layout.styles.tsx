import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const FloatingMainLinksContainer = styled(Stack)(({ theme }) => ({
  left: 0,
  right: 0,
  transform: 'translate3d(0, 0, 0)',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  bottom: theme.spacing(1.25),
  margin: theme.spacing(0, 2),
  padding: theme.spacing(1.25, 1.5),
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.background.default,
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
  borderRadius: 64,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface3.main,
  }),
}));

export const MainLinksContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(4),
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const SecondaryLinksContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifySelf: 'self-end',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));
