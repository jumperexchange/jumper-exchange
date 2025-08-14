import type { Breakpoint, ButtonProps as MuiButtonProps } from '@mui/material';
import { Box, styled } from '@mui/material';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { ButtonSecondary } from 'src/components/Button';

export const CampaignBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '24px',
  flexDirection: 'column',
  boxShadow: theme.shadows[2],
  padding: theme.spacing(2),
  height: '100%',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  }),
}));

export const CampaignInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  color: (theme.vars || theme).palette.white.main,

  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.black.main, // TODO: (theme.vars || theme).palette.primary.main,
  }),
}));

export const CampaignInfoTagBox = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.bgQuaternary.main,
  display: 'flex',
  padding: theme.spacing(0.5, 1),
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '24px',
  width: 'fit-content',
}));

export const CampaignInfoContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const CampaignInfoCtaButton = styled(ButtonSecondary)<MuiButtonProps>(
  ({ theme }) => ({
    gap: '8px',
    borderRadius: '24px',
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main, // TODO: (theme.vars || theme).palette.alphaLight100.main,
    },

    ...theme.applyStyles('light', {
      '&:hover': {
        backgroundColor: (theme.vars || theme).palette.alphaDark100.main, // TODO: (theme.vars || theme).palette.alphaDark100.main,
      },
    }),
    [theme.breakpoints.down('md' as Breakpoint)]: {
      marginTop: 16,
    },
  }),
);

export const BannerImageBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignSelf: 'center',
  width: '100%',
  height: 'auto',
  flexShrink: 0,
  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: '50%',
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: '60%',
  },
}));

interface BannerImageProps extends ImageProps {
  isImageLoading: boolean;
}

export const BannerImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isImageLoading',
})<BannerImageProps>(({ isImageLoading }) => ({
  position: 'relative',
  objectFit: 'cover',
  borderRadius: '16px',
  aspectRatio: '1200 / 675',
  width: '100%',
  height: 'auto',
  zIndex: 2,
  opacity: isImageLoading ? 0 : 1,
  transition: 'opacity 0.2s ease-in-out',
}));
