import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'src/components/Link';

export const MissionWidgetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
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

export const MissionInstructionFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const MissionDescriptionLink = styled(Link)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  ...theme.typography.bodyMediumStrong,
  textDecoration: 'none',
  display: 'inline-flex',
  width: 'fit-content',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  transition: 'color 0.3s ease',
  '&:hover': {
    color: (theme.vars || theme).palette.primary.main,
  },
  '& svg': {
    width: 20,
    height: 20,
  },
}));
