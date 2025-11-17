import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledTitleContainer = styled(Box)(() => ({
  width: '100%',
  textAlign: 'center',
}));

export interface StatusIconCircleProps {
  status?: 'error' | 'success';
}

export const StatusIconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<StatusIconCircleProps>(({ theme, status = 'error' }) => ({
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
      props: { status: 'error' },
      style: {
        backgroundColor: (theme.vars || theme).palette.statusErrorBg,
        '& > svg': {
          color: (theme.vars || theme).palette.statusErrorFg,
        },
      },
    },
    {
      props: { status: 'success' },
      style: {
        backgroundColor: (theme.vars || theme).palette.statusSuccessBg,
        '& > svg': {
          color: (theme.vars || theme).palette.statusSuccessFg,
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
