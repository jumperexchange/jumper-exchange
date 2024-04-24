import type { IconButtonProps } from '@mui/material';
import { Box, IconButton, alpha, styled } from '@mui/material';

export const AddressBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 24,
  ...(theme.palette.mode === 'light'
    ? {
        background: `linear-gradient(to bottom, ${theme.palette.primary.main} 50%, ${theme.palette.grey[100]} 50%)`,
      }
    : {
        background: `linear-gradient(to bottom, ${theme.palette.accent1Alt.main} 50%, transparent 50%)`,
      }),
  [theme.breakpoints.down('sm')]: {
    paddingTop: 37,
    paddingBottom: 8,
    ...(theme.palette.mode === 'light'
      ? {
          background: `linear-gradient(to bottom, ${theme.palette.primary.main} 50%, ${theme.palette.grey[100]} 50%)`,
        }
      : {
          background: `linear-gradient(to bottom, ${theme.palette.accent1Alt.main} 50%, transparent 50%)`,
        }),
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
    width: '32px',
    height: '32px',
    marginLeft: 8,
  }),
);

export const AddressDisplayBox = styled(Box)(() => ({
  display: 'flex',
  marginTop: 12,
}));

export const PassImageBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: 24,
  [theme.breakpoints.down('sm')]: {
    marginTop: 8,
    '& > img': {
      width: 64,
      height: 64,
    },
  },
}));
