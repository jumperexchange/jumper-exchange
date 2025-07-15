import Box, { type BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import {
  ButtonPrimary,
  ButtonTransparent,
} from 'src/components/Button/Button.style';

export const AddressBoxContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: (theme.vars || theme).shadows[1],
  background: (theme.vars || theme).palette.surface1.main,
  width: '100%',
  minHeight: 212,
  [theme.breakpoints.up('lg')]: {
    maxWidth: 320,
  },
}));

interface ImageForegroundProps extends ImageProps {
  imageLink?: string;
}

export const ImageForeground = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'imageLink',
})<ImageForegroundProps>(({ theme }) => ({
  backgroundColor: undefined,
  borderRadius: '100%',
  borderStyle: 'solid',
  borderWidth: 4,
  borderColor: (theme.vars || theme).palette.alphaDark700.main,
  zIndex: 1,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.alphaLight700.main,
  }),
  variants: [
    {
      props: ({ imageLink }) => imageLink,
      style: {
        backgroundColor: (theme.vars || theme).palette.accent1Alt.main,
        ...theme.applyStyles('light', {
          background: '#F9F5FF',
        }),
      },
    },
  ],
}));

export const AddressMenuToggle = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: 'transparent',
  color: (theme.vars || theme).palette.white.main,
  ':hover': {
    color: (theme.vars || theme).palette.white.main,
    background: (theme.vars || theme).palette.alphaLight400.main,
  },
}));

export const AddressButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const AddressButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: 32,
  background: 'transparent !important',
  borderRadius: '16px',
  color: (theme.vars || theme).palette.white.main,
  '&:hover': {
    background: `${(theme.vars || theme).palette.alphaLight400.main} !important`,
  },
}));

export const AddressConnectButton = styled(ButtonPrimary)(({ theme }) => ({
  textWrap: 'nowrap',
  height: 40,
  padding: theme.spacing(1, 2),
}));

export const AddressButtonLabel = styled(Typography)(({ theme }) => ({}));
export const AddressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  zIndex: 1,
  alignItems: 'center',
  height: 72,
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    gap: 0,
  },
}));

export const AddressContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    marginTop: 8,
    '& > img': {
      width: 128,
      height: 128,
    },
  },
}));

export interface ImageBackgroundProps extends BoxProps {
  imgUrl?: string;
}

export const ImageBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imgUrl',
})<ImageBackgroundProps>(({ theme, imgUrl }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  '&:before': {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: `url(${imgUrl})`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
  },
  '&:after': {
    content: '" "',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: (theme.vars || theme).palette.alphaDark600.main,
  },
  variants: [
    {
      props: ({ imgUrl }) => !imgUrl,
      style: {
        background: `linear-gradient(to bottom, ${(theme.vars || theme).palette.accent1Alt.main} 50%, ${'transparent'} 50%)`,

        ...theme.applyStyles('light', {
          background: `linear-gradient(to bottom, ${(theme.vars || theme).palette.primary.main} 50%, ${(theme.vars || theme).palette.grey[100]} 50%)`,
        }),
      },
    },
    {
      props: ({ imgUrl }) => imgUrl,
      style: {
        '&:before': { content: '" "' },
      },
    },
  ],
}));

export const ImageBackgroundPlaceholder = styled(Box)(({ theme }) => ({
  '&:after': {
    content: '" "',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    background: (theme.vars || theme).palette.alphaLight600.main,
    ...theme.applyStyles('light', {
      background: (theme.vars || theme).palette.alphaDark600.main,
    }),
  },
}));

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.grey[100],
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
