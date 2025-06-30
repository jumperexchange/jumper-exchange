'use client';
import { Box, Container as MuiContainer, Typography } from '@mui/material';

import { Breakpoint, styled } from '@mui/material/styles';

export const Container = styled(MuiContainer)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '32px',
  boxShadow: (theme.vars || theme).shadows[1],
  margin: theme.spacing(6, 2, 0),
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1.25),
  width: 'auto',

  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(8, 8, 0),
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2.25),
  },
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(12, 8, 0),
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(3.25),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
    paddingBottom: theme.spacing(5.25),
  },
  [theme.breakpoints.up('xl')]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export const ContainerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  justifyContent: 'space-between',
  color: (theme.vars || theme).palette.text.primary,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
  },
}));

export const ContainerInfos = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ContainerTitle = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  margin: theme.spacing(0, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
}));
