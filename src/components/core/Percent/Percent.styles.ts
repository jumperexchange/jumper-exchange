import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

export const PercentContainer = styled(Box)(() => ({
  position: 'relative',
}));

export const PercentCircularProgress = styled(CircularProgress)(
  ({ theme }) => ({
    '.MuiCircularProgress-track': {
      r: 21.45, // radius of the track; is dependant on the size and thickness of the component
      strokeWidth: 1.375,
      stroke: (theme.vars || theme).palette.statusPending,
      opacity: 1,
    },
  }),
);

export const PercentContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.8),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'absolute',
  top: '0',
  left: '0',
  maxWidth: '100%',
  width: '100%',
  height: '100%',
  '& > *:not(p)': {
    width: '100%',
    height: '100%',
  },
}));

export const PercentText = styled(Typography)(() => ({
  ...getTextEllipsisStyles(1),
  textAlign: 'center',
}));
