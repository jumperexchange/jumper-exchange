import type { Breakpoint, ButtonProps as MuiButtonProps } from '@mui/material';
import { Box, styled, Typography } from '@mui/material';
import Image from 'next/image';
import { ButtonSecondary } from 'src/components/Button';
import { getContrastAlphaColor } from 'src/utils/colors';

export const CampaignBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  flexDirection: 'column',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),

  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const CampaignInfoVerticalBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const CampaignTagBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgQuaternary.main,
  display: 'flex',
  padding: '4px 8px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(24),
  width: '33%',
}));

export const CampaignButton = styled;

export const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    fontSize: 32,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    fontSize: 48,
  },
}));

export const SubtitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const TextDescriptionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const BannerButton = styled(ButtonSecondary)<MuiButtonProps>(
  ({ theme }) => ({
    gap: '8px',
    borderRadius: '24px',
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    '&:hover': {
      backgroundColor: getContrastAlphaColor(theme, '4%'),
    },
    [theme.breakpoints.down('md' as Breakpoint)]: {
      marginTop: 16,
    },
  }),
);

export const BannerImage = styled(Image)(({ theme }) => ({
  objectFit: 'cover',
  borderRadius: '16px',
  aspectRatio: '1280 / 640',
  width: '100%',
  height: 'auto',

  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: '60%',
  },
}));
