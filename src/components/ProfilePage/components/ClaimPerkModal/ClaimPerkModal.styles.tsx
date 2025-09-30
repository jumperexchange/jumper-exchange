import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';

export const StyledTitleContainer = styled(Box)(({ theme }) => ({
  paddingY: theme.spacing(0.5),
  width: '100%',
  textAlign: 'center',
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  mt: theme.spacing(3),
  width: '100%',
  padding: theme.spacing(0, 3.5),
  '& .MuiStepConnector-root': {
    top: '10px',
    left: 'calc(-50% + 24px)',
    right: 'calc(50% + 24px)',
  },
  '& .MuiStepConnector-line': {
    border: 'none',
    borderRadius: '2px',
    height: '4px',
    backgroundColor: (theme.vars || theme).palette.grey[100],
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '0%',
      backgroundColor: (theme.vars || theme).palette.primary.main,
      borderRadius: '2px',
      transition: 'width 0.4s ease-in-out',
    },
  },
  '& .MuiStepConnector-root.Mui-active, & .MuiStepConnector-root.Mui-completed':
    {
      '& .MuiStepConnector-line::before': {
        width: '100%',
      },
    },

  '& .MuiStepLabel-label': {
    paddingTop: theme.spacing(1),
    marginTop: 0,
    color: (theme.vars || theme).palette.text.secondary,
    transition: 'color 0.3s ease',
  },
  '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed': {
    color: (theme.vars || theme).palette.text.primary,
  },
}));

export const StyledActiveStepContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// @Note we can expand this to use other statuses
export const ErrorIconCircle = styled(Box)(({ theme }) => {
  return {
    backgroundColor: (theme.vars || theme).palette.statusErrorBg,
    borderRadius: '50%',
    width: 72,
    height: 72,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    '& > svg': {
      color: (theme.vars || theme).palette.statusErrorFg,
      width: 36,
      height: 36,
    },
  };
});

export const StyledModalContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const StyledModalSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(5),
}));

export const StyledModalSectionHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const StyledTextSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  width: '100%',
}));
