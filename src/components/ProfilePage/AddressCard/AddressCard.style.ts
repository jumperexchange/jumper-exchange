import type { BoxProps, IconButtonProps } from '@mui/material';
import {
  Box,
  IconButton,
  Skeleton,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import {
  ButtonSecondary,
  ButtonTransparent,
} from 'src/components/Button/Button.style';

export const AddressBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.bgTertiary.main,
  alignItems: 'center',
  borderRadius: 24,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  boxShadow: theme.shadows[1],
  minHeight: 256,
  [theme.breakpoints.up('lg')]: {
    maxWidth: 320,
  },
}));

interface AddressBlockiesImageProps extends ImageProps {
  imageLink?: string;
}

export const AddressBlockiesImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'imageLink',
})<AddressBlockiesImageProps>(({ theme }) => ({
  backgroundColor: undefined,
  borderRadius: '100%',
  borderStyle: 'solid',
  borderWidth: '5px',
  borderColor: theme.palette.white.main,
  zIndex: 1,
  variants: [
    {
      props: ({ imageLink }) => imageLink,
      style: {
        backgroundColor:
          theme.palette.mode === 'light'
            ? '#F9F5FF'
            : theme.palette.accent1Alt.main,
      },
    },
  ],
}));

export const AddressBlockiesImageSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[400], 0.8),
  width: 140,
  height: 140,
}));

export const ProfileIconButton = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    backgroundColor: 'transparent',
    color:
      theme.palette.mode === 'light'
        ? theme.palette.black.main
        : theme.palette.grey[100],
    width: 32,
    height: 32,
    marginLeft: theme.spacing(1),
    ':hover': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.black.main
          : theme.palette.grey[100],
    },
  }),
);

export const AddressButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: 32,
  background: 'transparent',
  borderRadius: '16px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.white.main
        : theme.palette.alphaLight300.main,
  },
}));

export const AddressConnectButton = styled(ButtonSecondary)(({ theme }) => ({
  textWrap: 'nowrap',
  height: 40,
  padding: theme.spacing(1, 2),
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
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

export const PassImageBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: 8,
    '& > img': {
      width: 120,
      height: 120,
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
  bottom: 72,
  overflow: 'hidden',
  '&:before': {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    filter: 'blur(6px)',
    background: `url(${imgUrl})`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
  },
  variants: [
    {
      props: ({ imgUrl }) => !imgUrl,
      style: {
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(to bottom, ${theme.palette.primary.main} 50%, ${theme.palette.grey[100]} 50%)`
            : `linear-gradient(to bottom, ${theme.palette.accent1Alt.main} 50%, ${'transparent'} 50%)`,
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
