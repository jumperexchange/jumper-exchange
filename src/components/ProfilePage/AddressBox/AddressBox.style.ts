import type { BoxProps, IconButtonProps } from '@mui/material';
import { Box, IconButton, alpha, styled } from '@mui/material';

export interface AddressBoxContainerProps extends Omit<BoxProps, 'component'> {
  imgUrl?: string;
}

export const AddressBoxContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imgUrl',
})<AddressBoxContainerProps>(({ theme, imgUrl }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 24,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  boxShadow: theme.palette.shadow.main,
  minHeight: 256,

  ...(!imgUrl && {
    background: `linear-gradient(to bottom, ${theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.accent1Alt.main} 50%, ${theme.palette.mode === 'light' ? theme.palette.grey[100] : 'transparent'} 50%)`,
  }),

  [theme.breakpoints.up('lg')]: {
    maxWidth: 320,
  },

  '&:before': {
    ...(imgUrl && { content: '" "' }),
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 72,
    filter: 'blur(6px)',
    background: `url(${imgUrl})`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
  },
  '&:after': {
    ...(imgUrl && { content: '" "' }),
    position: 'absolute',
    left: 0,
    top: 'calc( 100% - 72px)',
    right: 0,
    bottom: 0,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : alpha(theme.palette.grey[100], 0.08),
  },
}));

export const ProfileIconButton = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : alpha(theme.palette.grey[200], 0.08),
    color:
      theme.palette.mode === 'light'
        ? theme.palette.black.main
        : theme.palette.grey[100],
    width: 32,
    height: 32,
    marginLeft: theme.spacing(1),
  }),
);

export const AddressDisplayBox = styled(Box)(({ theme }) => ({
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
  [theme.breakpoints.down('sm')]: {
    marginTop: 8,
    '& > img': {
      width: 120,
      height: 120,
    },
  },
}));
