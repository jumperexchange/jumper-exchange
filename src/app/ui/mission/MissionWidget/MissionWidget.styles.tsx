import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';

export const MissionWidgetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  borderRadius: `${theme.shape.cardBorderRadius}px`,
  boxShadow: theme.shadows[2],
}));

export const MissionWidgetContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const MissionWidgetTitle = styled(Typography)(() => ({}));

export const MissionWidgetDescription = styled(Typography)(() => ({}));

export const MissionWidgetIconContainer = styled(Box)(({ theme }) => ({
  width: 96,
  height: 96,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.mint[500],
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.mint[100],
  }),
}));

export const MissionWidgetIcon = styled(CheckIcon)(({ theme }) => ({
  width: 48,
  height: 48,
  color: (theme.vars || theme).palette.mint[100],
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.mint[500],
  }),
}));
