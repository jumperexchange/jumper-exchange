import type { Breakpoint } from '@mui/material';
import { alpha, Box } from '@mui/material';

import { darken, lighten, styled } from '@mui/material/styles';
import { ButtonPrimary } from 'src/components/Button';
import { IconButtonAlpha } from 'src/components/IconButton';
import { InfoMessageCard } from '../../MessageCard';

export const InfoAlertContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  left: 0,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(3),
  bottom: 0,
  zIndex: 2,
  [theme.breakpoints.up('md' as Breakpoint)]: {
    marginTop: 0,
    width: 'auto',
    justifyContent: 'flex-start',
    position: 'fixed',
  },
}));

export const InfoAlertCard = styled(InfoMessageCard)(({ theme }) => ({
  //todo: add to theme
  backgroundColor: '#00317A',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 384,
  },
  ...theme.applyStyles('light', {
    backgroundColor: '#EBF3FF',
  }),
}));

export const InfoAlertButton = styled(IconButtonAlpha)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
  width: 24,
  height: 24,
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.alphaDark100.main,
  }),
}));

export const ButtonInfoAlertClickable = styled(ButtonPrimary)(({ theme }) => ({
  height: 32,
  backgroundColor: lighten(theme.palette.info.main, 0.1),
  padding: theme.spacing(2),
  marginTop: theme.spacing(1.5),
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.info.main,
  },
  ...theme.applyStyles('light', {
    backgroundColor: darken(theme.palette.info.main, 0.1),
  }),
}));
