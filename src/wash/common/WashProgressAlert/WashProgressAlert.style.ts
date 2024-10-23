'use client';

import { Box, Button, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { inter } from 'src/fonts/fonts';
import { colors } from 'src/wash/utils/theme';
import { titanOne } from '../fonts';

export const WashProgressAlertContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(180deg, ${colors.violet[500]} 0%, #7601F1 100%)`,
  padding: `${theme.spacing(2)} !important`,
  position: 'relative',
  overflow: 'hidden',
  color: theme.palette.white.main,
  boxShadow: `0px 8px 16px ${alpha(theme.palette.common.black, 0.04)}`,
  borderRadius: '12px',
  border: `2px solid ${colors.violet[800]}`,
  maxWidth: 416,
  marginBottom: theme.spacing(1),
  display: 'block !important',
}));

export const WashProgressAlertTitle = styled(Typography)(({ theme }) => ({
  // color: theme.palette.info.main,
  fontFamily: titanOne.style.fontFamily, // '--titan-one-font', //
  display: 'flex',
  alignItems: 'center',
  textTransform: 'uppercase',
  fontSize: '16px',
  lineHeight: '20px',
}));

export const WashProgressAlertContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontFamily: inter.style.fontFamily,
  fontSize: '12px',
  lineHeight: '16px',
  maxWidth: 224,
}));

export const WashProgressAlertButton = styled(Button)(({ theme }) => ({
  color: 'inherit',
  marginTop: theme.spacing(1),
  fontSize: '12px',
  height: 32,
  minWidth: 120,
  fontWeight: 700,
  backgroundColor: colors.pink[800],
  ':hover': {
    backgroundColor: alpha(colors.pink[800], 0.8),
  },
}));

interface WashProgressAlertImageProps extends ImageProps {
  isRare?: boolean;
}

export const WashProgressImageWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  top: theme.spacing(3),
  width: 128,
  height: 128,
  ':before, :after': {
    content: '""',
    position: 'absolute',
    width: 160,
    height: 61,
    backgroundImage: 'url("/wash/foam.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  },
  ':before': {
    left: -66,
    bottom: 9,
    transform: 'rotate(9.27deg)',
  },
  ':after': {
    bottom: 14,
    right: -16,
  },
}));

export const WashProgressAlertImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isRare',
})<WashProgressAlertImageProps>(({ theme, isRare }) => ({
  borderColor: isRare ? colors.orange[800] : colors.violet[700],
  borderWidth: '3px',
  borderRadius: '8px',
  // ':before': {
  //   content: '""',
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   backgroundImage: 'url("/wash/foam.png")',
  // },
  // ':after': {
  //   content: 'url("/wash/foam.png")',
  //   position: 'absolute',
  //   width: '128px',
  //   height: '42px',
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'red',
  // },
}));

export const WashProgressFoam = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isRare',
})(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  top: theme.spacing(3),
  width: '100%',
  height: '100%',
  backgroundImage: 'url("/wash/foam.png")',
  backgroundRepeat: 'no-repeat',

  // ':after': {
  //   content: 'url("/wash/foam.png")',
  //   position: 'absolute',
  //   width: '128px',
  //   height: '42px',
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'red',
  // },
}));

export const WashProgressInfo = styled(Typography)(({ theme }) => ({
  // color: theme.palette.info.main,
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 700,
  justifyContent: 'center',
  backgroundColor: colors.violet[400],
  border: `2px solid ${colors.pink[800]}`,
  borderRadius: '8px',
  width: 80,
  height: 25,
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));
