import type { Breakpoint } from '@mui/material';
import { IconButton, Typography } from '@mui/material';
import { alpha, Box, styled } from '@mui/material';
import Link from 'next/link';

export const InformationShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const ColoredProtocolShareButton = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.white.main, 0.08),
  color: theme.palette.text.primary,
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.white.main, 0.16),
  },
}));

export const CampaignHeaderBoxBackground = styled(Box)(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: 180,
  borderRadius: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

export const VerticalCenterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export const CampaignTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.white.main,
  fontWeight: 700,
  fontSize: 32,
}));

export const CardInfoTypogragphy = styled(Typography)(({ theme }) => ({
  color: theme.palette.white.main,
  fontWeight: 700,
}));

export const CampaignDigitInfoBox = styled(Box)(({ theme }) => ({
  width: '216px',
  backgroundColor: '#43CE8740',
  boxShadow: '0 4px 6px #00000020',
  borderRadius: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
