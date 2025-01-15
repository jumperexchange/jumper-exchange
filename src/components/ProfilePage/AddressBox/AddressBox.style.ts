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
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 24,
  paddingTop: theme.spacing(3),
  overflow: 'hidden',
  position: 'relative',
  paddingBottom: theme.spacing(1),
  width: '100%',
  minHeight: 200,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up('sm')]: {
    minHeight: 256,
    paddingTop: 0,
    paddingBottom: 0,
  },
  '&:before': {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: '50%',
    filter: 'blur(6px)',
    background: `url(${imgUrl})`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
  },
  '&:after': {
    position: 'absolute',
    left: 0,
    top: '50%',
    right: 0,
    bottom: 0,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : alpha(theme.palette.grey[100], 0.08),
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
    {
      props: ({ imgUrl }) => imgUrl,
      style: {
        '&:after': { content: '" "' },
      },
    },
  ],
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
    width: '32px',
    height: '32px',
    marginLeft: theme.spacing(1),
  }),
);

export const AddressDisplayBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    flexWrap: 'nowrap',
    gap: 0,
  },
}));

export const PassImageBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    marginTop: 8,
    '& > img': {
      width: 84,
      height: 84,
    },
  },
}));
