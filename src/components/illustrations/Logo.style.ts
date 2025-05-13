'use client';
import { styled } from '@mui/material';

export const LogoWrapper = styled('div')(({ theme }) => {
  const subCol = (theme.vars || theme).palette.accent2.main;

  return {
    cursor: 'pointer',
    display: 'flex',
    fill: 'none',
    '.main-color': {
      fill: (theme.vars || theme).palette.accent1Alt.main,
      ...theme.applyStyles('light', {
        fill: (theme.vars || theme).palette.accent1.main,
      }),
    },
    '.sub-color': {
      fill: subCol,
    },
    [theme.breakpoints.down('sm')]: {
      '& .jumper-learn-logo, & .jumper-logo, ': {
        width: 32,
        height: 32,
      },
      '& .jumper-learn-logo-desktop, & .jumper-logo-desktop': {
        display: 'none',
      },
    },
  };
});

export const CollabLogoWrapper = styled('div')(({ theme }) => {
  const subCol = (theme.vars || theme).palette.accent2.main;

  return {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    fill: 'none',
    '.main-color': {
      fill: (theme.vars || theme).palette.accent1.main,
      ...theme.applyStyles('light', {
        fill: (theme.vars || theme).palette.accent1Alt.main,
      }),
    },
    '.sub-color': {
      fill: subCol,
    },
    [theme.breakpoints.down('sm')]: {
      '& .jumper-learn-logo, & .jumper-logo, ': {
        width: 32,
        height: 32,
      },
      '& .jumper-learn-logo-desktop, & .jumper-logo-desktop': {
        display: 'none',
      },
    },
  };
});
