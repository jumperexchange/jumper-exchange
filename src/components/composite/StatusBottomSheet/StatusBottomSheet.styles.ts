import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledTitleContainer = styled(Box)(() => ({
  width: '100%',
  textAlign: 'center',
}));

interface StatusIconCircleProps {
  status: 'success' | 'error' | 'info';
}

export const StatusIconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<StatusIconCircleProps>(({ theme }) => ({
  borderRadius: '50%',
  width: 96,
  height: 96,
  display: 'grid',
  position: 'relative',
  placeItems: 'center',
  '& > svg': {
    fontSize: 48,
  },
  variants: [
    {
      props: ({ status }) => status === 'success',
      style: {
        backgroundColor: (theme.vars || theme).palette.statusSuccessBg,
        '& > svg': {
          color: (theme.vars || theme).palette.statusSuccessFg,
        },
      },
    },
    {
      props: ({ status }) => status === 'error',
      style: {
        backgroundColor: (theme.vars || theme).palette.statusErrorBg,
        '& > svg': {
          color: (theme.vars || theme).palette.statusErrorFg,
        },
      },
    },
    {
      props: ({ status }) => status === 'info',
      style: {
        backgroundColor: (theme.vars || theme).palette.statusInfoBg,
        '& > svg': {
          color: (theme.vars || theme).palette.statusInfoFg,
        },
      },
    },
  ],
}));

export const StyledModalContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const StyledButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));
