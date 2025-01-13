'use client';

import { Box, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, darken, lighten, styled } from '@mui/material/styles';

const MessageCard = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  whiteSpace: 'pre-line',
  margin: 'auto',
  width: '100%',
  padding: theme.spacing(2, 3),
  boxShadow:
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 416,
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  }),
}));

export const WarningMessageCard = styled(MessageCard)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.warning.main, 0.16),
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.warning.main, 0.24),
  }),
}));

export const WarningMessageCardTitle = styled(Box)(({ theme }) => ({
  padding: 0,
  color: alpha(theme.palette.warning.dark, 1),
  ...theme.applyStyles('light', {
    color: darken(theme.palette.warning.main, 0.36),
  }),
}));

export const InfoMessageCard = styled(MessageCard)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.16),
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.info.main, 0.12),
  }),
}));

export const InfoMessageCardTitle = styled(Box)(({ theme }) => ({
  padding: 0,
  color: lighten(theme.palette.info.main, 0.24),
  ...theme.applyStyles('light', {
    color: theme.palette.info.main,
  }),
}));

export const InfoMessageCardClickable = styled(MessageCard)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.16),
  cursor: 'pointer',
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.info.main, 0.12),
  }),
}));

export const InfoMessageCardSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.black.main,
}));
