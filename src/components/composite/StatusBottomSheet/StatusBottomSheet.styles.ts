import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledTitleContainer = styled(Box)(() => ({
  width: '100%',
  textAlign: 'center',
}));

export const ErrorIconCircle = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.statusErrorBg,
  borderRadius: '50%',
  width: 96,
  height: 96,
  display: 'grid',
  position: 'relative',
  placeItems: 'center',
  '& > svg': {
    color: (theme.vars || theme).palette.statusErrorFg,
    fontSize: 48,
  },
}));

export const StyledModalContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));
