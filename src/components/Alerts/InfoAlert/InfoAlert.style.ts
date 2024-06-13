import type { BoxProps, Breakpoint } from '@mui/material';
import { Box } from '@mui/material';

import { styled } from '@mui/material/styles';
import { IconButtonAlpha } from 'src/components/IconButton';
import { getContrastAlphaColor } from 'src/utils/colors';
import { InfoMessageCard } from '../../MessageCard/';

export const InfoAlertContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  position: 'fixed',
  left: 0,
  padding: theme.spacing(1.5),
  bottom: 0,
  zIndex: 2,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 'auto',
  },
}));

export const InfoAlertCard = styled(InfoMessageCard)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#EBF3FF' : '#00317A', //todo: add to theme
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 384,
  },
}));

export const InfoAlertButton = styled(IconButtonAlpha)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  backgroundColor: getContrastAlphaColor(theme, 0.04),
  width: 24,
  height: 24,
}));
